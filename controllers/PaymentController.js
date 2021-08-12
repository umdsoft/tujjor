const Errors = require("../utils/paymeErrors");
const Order = require("../models/order");
const Size = require("../models/size");
const Transaction = require("../models/transaction");
const PayedList = require("../models/payedList");
exports.payme = async (req, res) => {
    // merchant ID: 6113b418754e932e68fd87ad
    const PAYCOM_PASSWORD = "&ibgXksdw0S9#aORZ80Vb0HO0SQNFYmEEkgq" //test
    // const PAYCOM_PASSWORD = "Pb61wSM%ajGhIhxqEsDAWOW8Hg0hkbjG9JCJ" //production
    const body = req.body;
    if (req.method !== "POST") {
        return sendResponse(Errors.TransportError, null);
    }
    //проверяем авторизацию запроса.
    if (!checkAuth(req.headers["authorization"])) {
        //если запрос авторизован возвращаем ошибку -32504
        return sendResponse(Errors.AccessDeniet, null);
    }
    if (body.method === "CheckPerformTransaction") {
        CheckPerformTransaction(body.params);
    } else if (body.method === "CreateTransaction") {
        CreateTransaction(body.params);
    } else if (body.method === "PerformTransaction") {
        PerformTransaction(body.params);
    } else if (body.method === "CheckTransaction") {
        CheckTransaction(body.params);
    } else if (body.method === "CancelTransaction") {
        CancelTransaction(body.params);
    }
    async function CheckPerformTransaction(params) {
        await Order.findOne({ orderId: params.account.order }, (err, data) => {
            if (err || !data) {
                return sendResponse(Errors.OrderNotFound, null);
            }
            if (data.status) {
                return sendResponse(Errors.OrderAvailable, null);
            }
            if (data.amount * 100 !== params.amount) {
                return sendResponse(Errors.IncorrectAmount, null);
            }
            return sendResponse(null, {
                allow: true,
            });
        });
    }

    async function CreateTransaction(params) {
        await Transaction.findOne({ tid: params.id }, async (err, data) => {
            const receivers = [];
            if (err || !data) {
                await Order.findOne(
                    { orderId: params.account.order },
                    async (err, data) => {
                        if (err || !data) return sendResponse(Errors.OrderNotFound, null);
                        if (data.status) {
                            return sendResponse(Errors.OrderAvailable, null);
                        }
                        if (data.amount !== params.amount / 100)
                            return sendResponse(Errors.IncorrectAmount, null);
                        data.products.forEach((key) => {
                            receivers.push({
                                id: key.account,
                                amount: key.count * key.amount * 100,
                            });
                        });

                        const transaction = new Transaction({
                            tid: params.id,
                            amount: params.amount / 100,
                            transaction: Math.floor(
                                Math.random() * 1000000000
                            ).toString(),
                            state: 1,
                            perform_time: 0,
                            cancel_time: 0,
                            create_time: Date.now(),
                            order: parseInt(params.account.order),
                            time: params.time,
                            receivers: receivers,
                        });
                        transaction
                            .save()
                            .then(() => {
                                return sendResponse(null, {
                                    transaction: transaction.transaction,
                                    state: transaction.state,
                                    create_time: transaction.create_time,
                                    perform_time: transaction.perform_time,
                                    cancel_time: transaction.cancel_time,
                                    receivers: transaction.receivers,
                                });
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    }
                );
            }

            if (data) {
                if(param.id !== data.tid){
                    return sendResponse(Errors.YesTransaction, null);
                }
                if (data.state === 1) {
                    if (data.time > params.time) {
                        await Transaction.updateOne(
                            { tid: data._id },
                            {
                                $set: {
                                    state: -1,
                                    reason: 4,
                                },
                            },
                            (err, data) => {
                                return sendResponse(
                                    Errors.UnexpectedTransactionState,
                                    null
                                );
                            }
                        );
                    } else {
                        return sendResponse(null, {
                            state: data.state,
                            create_time: data.create_time,
                            transaction: data.transaction,
                            perform_time: data.perform_time || 0,
                            cancel_time: data.cancel_time || 0,
                            receivers: data.receivers,
                        });
                    }
                } else {
                    return sendResponse(Errors.UnexpectedTransactionState, null);
                }
            }
        });
    }

    async function PerformTransaction(params) {
        await Transaction.findOne({ tid: params.id }, async (err, transaction) => {
            if (!transaction) return sendResponse(Errors.TransactionNotFound, null);
            if (transaction.state === 1) {
                if (transaction.time > Date.now()) {
                    await Transaction.updateOne(
                        { tid: params.id },
                        {
                            $set: {
                                state: -1,
                                reason: 4,
                            },
                        }
                    );
                }
                const order = await Order.findOne({
                    orderId: transaction.order,
                });
                order.products.forEach( async(key) => {
                    new PayedList({
                        user: order.user,
                        shop: key.shop,
                        category: key.category,
                        brand: key.brand,
                        amount: key.amount,
                        count: key.count,
                    }).save();
                    let size = await Size.findOne({_id:key.sizeId});
                    size.count = size.count - key.count;
                    size.save();
                });
                
                await Order.updateOne(
                    { orderId: transaction.order },
                    {
                        $set: {
                            payed: 1,
                            status: 1,
                            paySystem: "payme",
                        },
                    }
                );
                await Transaction.updateOne(
                    { tid: transaction.tid },
                    {
                        $set: {
                            state: 2,
                            perform_time: Date.now(),
                        },
                    }
                );
                const tt = await Transaction.findOne({
                    tid: transaction.tid,
                });
                return sendResponse(null, {
                    transaction: transaction.transaction,
                    perform_time: tt.perform_time,
                    state: 2,
                });
            }
            if (transaction.state === 2) {
                return sendResponse(null, {
                    transaction: transaction.transaction,
                    perform_time: transaction.perform_time,
                    state: transaction.state,
                });
            } else {
                return sendResponse(Errors.UnexpectedTransactionState, null);
            }
        });
    }

    async function CancelTransaction(params) {
        await Transaction.findOne({ tid: params.id }, async (err, transaction) => {
            if (err || !transaction)
                return sendResponse(Errors.TransactionNotFound, null);
            if (transaction.state === 1) {
                await Transaction.updateOne(
                    { tid: transaction.tid },
                    {
                        $set: {
                            state: -1,
                            reason: params.reason,
                            cancel_time: Date.now(),
                        },
                    }
                );
                await Transaction.findOne({ tid: transaction.tid }, async () => {
                    await Order.updateOne(
                        { orderId: transaction.order },
                        {
                            $set: {
                                payed: 0,
                            },
                        },
                        async (err, data) => {
                            if (err) return sendResponse(err, null);
                            const ord = await Order.find({
                                orderId: transaction.order,
                            });
                            await Order.findOneAndDelete(
                                { _id: ord._id },
                                (err, data) => {
                                    if (err) return sendResponse(err, null);
                                }
                            );
                            return sendResponse(null, {
                                state: data.state,
                                cancel_time: data.cancel_time,
                                transaction: data.transaction,
                                create_time: data.create_time,
                                perform_time: data.perform_time || 0,
                            });
                        }
                    );
                });
            } else {
                if (transaction.state === 2) {
                    await Order.findOne(
                        { orderId: transaction.order },
                        async (err, order) => {
                            if (err) return sendResponse(err, null);
                            if (order.payed === 0) {
                                await Transaction.updateOne(
                                    { tid: params.id },
                                    {
                                        $set: {
                                            state: -2,
                                            reason: params.reason,
                                            cancel_time: Date.now(),
                                        },
                                    }
                                ).exec((err, transac) => {
                                    return sendResponse(null, {
                                        state: transac.state,
                                        cancel_time: transac.cancel_time || 0,
                                        transaction: transac.transaction,
                                        create_time: transac.create_time,
                                        perform_time: transac.perform_time || 0,
                                    });
                                });
                            } else {
                                return sendResponse(Errors.OrderNotСanceled, null);
                            }
                        }
                    );
                } else {
                    return sendResponse(null, {
                        state: transaction.state,
                        cancel_time: transaction.cancel_time || 0,
                        transaction: transaction.transaction,
                        create_time: transaction.create_time,
                        perform_time: transaction.perform_time || 0,
                    });
                }
            }
        });
    }

    async function CheckTransaction(params) {
        await Transaction.findOne({ tid: params.id }, (err, data) => {
            if (err || !data) return sendResponse(Errors.TransactionNotFound, null);
            return sendResponse(null, {
                create_time: data.create_time,
                perform_time: data.perform_time || 0,
                cancel_time: data.cancel_time || 0,
                transaction: data.transaction,
                state: data.state,
                reason: data.reason || null,
            });
        });
    }

    function sendResponse(error, result) {
        res.writeHead(200, {
            "Content-Type": "application/json; charset=utf-8",
        });

        res.end(
            JSON.stringify({
                jsonrpc: "2.0",
                error: error || undefined,
                result: result || undefined,
                id: body.id,
            })
        );
    }

    function checkAuth(auth) {
        return (
            auth && //проверяем существование заголовка
            (auth = auth.trim().split(/ +/)) && //разделяем заголовок на 2 части
            auth[0] === "Basic" &&
            auth[1] && //проверяем правильность формата заголовка
            (auth = Buffer.from(auth[1], "base64").toString("utf-8")) && //декодируем из base64
            (auth = auth.trim().split(/ *: */)) && //разделяем заголовок на логин пароль
            auth[0] === "Paycom" && //проверяем логин
            auth[1] === PAYCOM_PASSWORD
        ); //проверяем пароль
    }
};
