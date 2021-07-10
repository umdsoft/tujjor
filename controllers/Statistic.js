const PayedList = require("../models/payedList");

exports.statShop = async (req, res) => {
    PayedList.aggregate([
        {
            $match: {
                $and: [
                    { createdAt: { $gte: new Date(req.body.start) } },
                    { createdAt: { $lte: new Date(req.body.end) } },
                ],
            },
        },
        {
            $group: {
                _id: "$shop",
                amount: { $sum: "$amount" },
                count: { $sum: "$count" },
            },
        },
        {
            $lookup: {
                from: "shops",
                let: { shop: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$_id", "$$shop"] },
                        },
                    },
                ],
                as: "shop",
            },
        },
        {
            $project: {
                _id: 0,
            },
        },
    ]).exec((err, data) => {
        if (err) return res.status(400).json({ success: false, err });
        res.status(200).json({
            success: true,
            data,
        });
    });
};
