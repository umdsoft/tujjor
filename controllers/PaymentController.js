const Errors = require("../utils/paymeErrors");
const Order = require("../models/order");
const Transaction = require("../models/transaction");
exports.payme = async (req, res) => {
    const PAYCOM_PASSWORD = "zBnGw3@28ByVqDM?ib7ojWN9PCvuI3%PW&AG";
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
    }
    async function CheckPerformTransaction(params) {
        await Order.findOne({ orderId: params.account.order }, (err, data) => {
            if (err || !data) {
                return sendResponse(Errors.OrderNotFound, null);
            }
            if (!data.status) {
                return sendResponse(Errors.OrderAvailable, null);
            }
            if (data.amount * 100 !== params.amount) {
                return sendResponse(Errors.IncorrectAmount, null);
            }
            return "success";
        });
    }

    async function CreateTransaction(params) {
        await Transaction.findOne({ tid: params.id }, async (err, data) => {
            const receivers = [];
            if (err || !data) {
                await Order.findOne(
                    { orderId: params.account.order },
                    async (err, data) => {
                        if (err || !data)
                            return sendResponse(Errors.OrderNotFound, null);
                        if (data.payed === 1)
                            return sendResponse(Errors.OrderAvailable, null);
                        if (data.amount !== params.amount / 100)
                            return sendResponse(Errors.IncorrectAmount, null);
                        data.products.forEach((key) => {
                            receivers.push({
                                id: key.account,
                                amount: key.amount,
                            });
                        });
                    }
                );

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
                        console.log("saved");
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

            if (data) {
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
                            receivers: receivers,
                        });
                    }
                } else {
                    return sendResponse(
                        Errors.UnexpectedTransactionState,
                        null
                    );
                }
            }
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
            (auth = new Buffer(auth[1], "base64").toString("utf-8")) && //декодируем из base64
            (auth = auth.trim().split(/ *: */)) && //разделяем заголовок на логин пароль
            auth[0] === "Paycom" && //проверяем логин
            auth[1] === PAYCOM_PASSWORD
        ); //проверяем пароль
    }
};
