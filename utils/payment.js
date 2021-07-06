exports.BillingErrors = {
    TransactionNotFound: function () {
        return {
            code: -31001,
            message: "Транзакция не найденна",
            data: null,
        };
    },
    UnexpectedTransactionState: function () {
        return {
            code: -31008,
            message: {
                ru: "Статус транзакции не позволяет выполнить операцию",
            },
            data: null,
        };
    },
    YesTransaction: function () {
        return {
            code: -31001,
            message: "Kuting",
        };
    },
    IncorrectAmount: function () {
        return {
            code: -31001,
            message: {
                ru: "Неверная сумма заказа",
                uz: "Buyurtma summasi noto`g`ri",
                en: "Incorrect order price",
            },
            data: null,
        };
    },
    OrderNotFound: function () {
        return {
            code: -31050,
            message: {
                ru: "Заказ не найден",
                uz: "Buyurtma topilmadi",
                en: "Order not found",
            },
            data: "order",
        };
    },
    OrderAvailable: function () {
        return {
            code: -31051,
            message: {
                ru: "Не возможно выполнить операцию. Заказ ожидает оплаты или оплачен.",
            },
            data: "order",
        };
    },
    OrderNotСanceled: function () {
        return {
            code: -31007,
            message: {
                ru: "Заказ полность выполнен и не подлежит отмене.",
            },
            data: null,
        };
    },
};

exports.RPCErrors = {
    TransportError: function () {
        return {
            code: -32300,
            message: "Transport Error",
            data: null,
        };
    },

    AccessDeniet: function () {
        return {
            code: -32504,
            message: "AccessDeniet",
            data: null,
        };
    },

    ParseError: function () {
        return {
            code: -32700,
            message: "Parse Error",
            data: null,
        };
    },

    MethodNotFound: function () {
        return {
            code: -32601,
            message: "Method not found",
            data: null,
        };
    },
};
