const PayedList = require("../models/payedList");

exports.statShop = async (req, res) => {
    PayedList.aggregate([
        {
            $match: {
                createdAt: {
                    $and: [
                        { createdAt: { $gte: new Date(req.body.start) } },
                        { createdAt: { $lte: new Date(req.body.end) } },
                    ],
                },
            },
        },
        {
            $group: {
                _id: "$shop",
                price: { $sum: "$price" },
                count: { $sum: "$count" },
            },
        },
    ]).exec((err, data) => {});
};
