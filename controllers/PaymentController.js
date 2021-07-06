const Order = require("../models/order");
const sendResponse = (res, body, error, result) => {
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
};

const checkAuth = (auth) => {
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
};
const CheckPerformTransaction = async (param, res) => {
    Order.findOne({ _id: param.account.order }, (err, data) => {
        if (err || !data) {
        }
    });
};
exports.payme = async (req, res) => {
    const body = req.body;

    // if(body)
};
