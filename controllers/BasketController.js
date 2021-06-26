const Basket = require("../models/basket");

exports.create = (req, res) => {
    const basket = new Basket({
        user: req.body.user,
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
        { $match: { user: mongoose.Types.ObjectId(req.params.user) } },
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
                as: "param",
            },
        },
    ]).exec((err, data) => {
        if (err) {
            return res.status(400).json({ success: false, err });
        }
        return res.status(200).json({ success: true, data });
    });
    await Basket.find({ user: req.params.user }).populate([
        {
            path: "param",
            select: "image -_id",
        },
        {
            path: "size",
            select: "size price count -_id",
        },
        {
            path: "product",
            select: "name image category -_id",
        },
    ]);
};
exports.edit = async (req, res) => {
    await Basket.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
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