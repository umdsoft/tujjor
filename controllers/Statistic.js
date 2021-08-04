const PayedList = require("../models/payedList");

exports.statShop = async (req, res) => {
    PayedList.aggregate([
        {
            $match: {
                $and: [{ createdAt: { $gte: new Date(req.body.start) } }, { createdAt: { $lte: new Date(req.body.end) } }],
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
        { $unwind: "$shop" },
        {
            $project: {
                shop: "$shop.shopName",
                amount: 1,
                count: 1,
                _id: 0,
            },
        },
        {$sort: { amount: -1 }}
    ]).exec((err, data) => {
        if (err) return res.status(400).json({ success: false, err });
        res.status(200).json({
            success: true,
            data,
        });
    });
};

exports.statBrand = async (req, res) => {
    PayedList.aggregate([
        {
            $match: {
                $and: [{ createdAt: { $gte: new Date(req.body.start) } }, { createdAt: { $lte: new Date(req.body.end) } }],
            },
        },
        {
            $group: {
                _id: "$brand",
                amount: { $sum: "$amount" },
                count: { $sum: "$count" },
            },
        },
        {
            $lookup:
                {
                    from: "brands",
                    localField: "_id",
                    foreignField: "_id",
                    as: "brand"
                }
        },
        { $unwind: "$brand" },
        {
            $project: {
                brand: "$brand.name",
                amount: 1,
                count: 1,
                _id: 0,
            },
        },
        {$sort: { amount: -1 }}
    ]).exec((err, data) => {
        if (err) return res.status(400).json({ success: false, err });
        res.status(200).json({
            success: true,
            data,
        });
    });
};

exports.statUser = async (req, res) => {
    PayedList.aggregate([
        {
            $match: {
                $and: [{ createdAt: { $gte: new Date(req.body.start) } }, { createdAt: { $lte: new Date(req.body.end) } }],
            },
        },
        {
            $group: {
                _id: "$user",
                amount: { $sum: "$amount" },
                count: { $sum: "$count" },
            },
        },
        {
            $lookup:
                {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user"
                }
        },
        { $unwind: "$user" },
        {
            $project: {
                user: "$user.name",
                amount: 1,
                count: 1,
                _id: 0,
            },
        },
        {$sort: { amount: -1 }}
    ]).exec((err, data) => {
        if (err) return res.status(400).json({ success: false, err });
        res.status(200).json({
            success: true,
            data,
        });
    });
};

exports.statCategory = async (req, res) => {
    PayedList.aggregate([
        {
            $match: {
                $and: [{ createdAt: { $gte: new Date(req.body.start) } }, { createdAt: { $lte: new Date(req.body.end) } }],
            },
        },
        {
            $group: {
                _id: "$category",
                amount: { $sum: "$amount" },
                count: { $sum: "$count" },
            },
        },
        {
            $lookup:
                {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category"
                }
        },
        { $unwind: "$category" },
        {
            $project: {
                category: "$category.name",
                amount: 1,
                count: 1,
                _id: 0,
            },
        },
        {$sort: { amount: -1 }}
    ]).exec((err, data) => {
        if (err) return res.status(400).json({ success: false, err });
        res.status(200).json({
            success: true,
            data,
        });
    });
};
