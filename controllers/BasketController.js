const Basket = require("../models/basket");
const mongoose = require("mongoose");
exports.create = (req, res) => {
    const basket = new Basket({
        user: req.user,
        param: req.body.param,
        size: req.body.size,
        product: req.body.product,
        count: req.body.count,
    });
    basket
        .save()
        .then(() => {
            return res.status(200).json({ success: true, data: basket });
        })
        .catch((err) => {
            return res.status(400).json({ success: false, err });
        });
};
exports.getAll = async (req, res) => {
    Basket.aggregate([
        { $match: { user: mongoose.Types.ObjectId(req.user) } },
        {
            $lookup: {
                from: "params",
                let: { param: "$param" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$_id", "$$param"] },
                        },
                    },
                    { $project: { image: 1, _id: 0 } },
                ],
                as: "param",
            },
        },
        {
            $lookup: {
                from: "sizes",
                let: { size: "$size" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$_id", "$$size"] },
                        },
                    },
                    { $project: { size: 1, price: 1, count: 1, _id: 0 } },
                ],
                as: "size",
            },
        },
        {
            $lookup: {
                from: "products",
                let: { product: "$product" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$_id", "$$product"] },
                        },
                    },
                    { $project: { slug: 1, image: 1, _id: 0 } },
                ],
                as: "product",
            },
        },
    ]).exec((err, data) => {
        if (err) {
            return res.status(400).json({ success: false, err });
        }
        return res.status(200).json({ success: true, data });
    });
};
exports.getCount = async (req, res) => {
    Basket.aggregate([
        { $match: { user: mongoose.Types.ObjectId(req.user) } },
        { $group: { _id: null, count: { $sum: 1 } } },
    ]).exec((err, data) => {
        if (err) {
            return res.status(400).json({ success: false, err });
        }
        return res.status(200).json({ success: true, count: data[0].count });
    });
};
exports.edit = async (req, res) => {
    await Basket.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: { count: req.body.count } },
        (err, data) => {
            if (err) {
                return res.status(400).json({ success: false, err });
            }
            return res.status(200).json({ success: true });
        }
    );
};
exports.delete = async (req, res) => {
    await Basket.findByIdAndDelete({ _id: req.params.id }, (err, data) => {
        if (err) {
            return res
                .status(400)
                .json({ success: false, message: "Not found" });
        }
        res.status(200).json({ success: true });
    });
};
