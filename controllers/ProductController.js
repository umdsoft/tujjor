const mongoose = require("mongoose");
const Product = require("../models/product");
const Param = require("../models/param");
const Size = require("../models/size");
const ProductImage = require("../models/productImage");
const { getSlug } = require("../utils");
exports.create = (req, res) => {
    const product = new Product({
        name: {
            uz: req.body.name.uz,
            ru: req.body.name.ru,
        },
        shop: req.body.shop,
        category: req.body.category,
        brand: req.body.brand,
        description: {
            uz: req.body.description?.uz || "",
            ru: req.body.description?.ru || "",
        },
        article: req.body.article,
        tags: req.body.tags || "",
        slug: getSlug(req.body.name.ru),
    });
    product
        .save()
        .then((data) => {
            res.status(200).json({ success: true, data: { _id: data._id } });
        })
        .catch((err) => {
            res.status(500).json({
                message:
                    err.message ||
                    "Something wrong while creating the product.",
            });
        });
};
exports.createParam = (req, res) => {
    const param = new Param({
        color: req.body.color,
        productId: req.body.productId,
    });
    param
        .save()
        .then((data) => {
            res.status(200).json({ success: true, data: { _id: data._id } });
        })
        .catch((err) => {
            res.status(500).json({
                message:
                    err.message || "Something wrong while creating the param.",
            });
        });
};
exports.createSize = (req, res) => {
    const size = new Size({
        productId: req.body.productId,
        paramId: req.body.paramId,
        size: req.body.size,
        price: req.body.price,
        count: req.body.count,
    });
    size.save()
        .then((data) => {
            res.status(200).json({ success: true });
        })
        .catch((err) => {
            res.status(500).json({
                message:
                    err.message || "Something wrong while creating the size.",
            });
        });
};
exports.createImage = (req, res) => {
    const image = new ProductImage({
        paramId: req.body.paramId,
        productId: req.body.productId,
        image: `/uploads/productImages/${req.file.filename}`,
    });

    image
        .save()
        .then(() => {
            res.status(200).json({ success: true });
        })
        .catch((err) => {
            res.status(500).json({
                message:
                    err.message || "Something wrong while creating the image.",
            });
        });
};
//price , category, brand, color, size, tags,
exports.filter = async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const num = await Product.countDocuments();
    let aggregateStart = [];
    let aggregateEnd = [];

    if (req.body.category && req.body.category.length) {
        aggregateStart.push({
            $match: {
                category: {
                    $in: req.body.category.map((key) =>
                        mongoose.Types.ObjectId(key)
                    ),
                },
            },
        });
    }
    if (req.body.brand && req.body.brand.length) {
        aggregateStart.push({
            $match: {
                brand: {
                    $in: req.body.brand.map((key) =>
                        mongoose.Types.ObjectId(key)
                    ),
                },
            },
        });
    }
    if (req.body.color) {
        aggregateEnd.push({
            $match: {
                params: { $elemMatch: { color: req.body.color } },
            },
        });
    }
    if (req.body.size) {
        aggregateEnd.push({
            $match: {
                params: {
                    $elemMatch: {
                        sizes: { $elemMatch: { size: req.body.size } },
                    },
                },
            },
        });
    }
    await Product.aggregate([
        ...aggregateStart,
        {
            $lookup: {
                from: "categories",
                let: { category: "$category" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$_id", "$$category"] } } },
                    { $project: { name: 1, _id: 0 } },
                ],
                as: "category",
            },
        },
        { $unwind: "$category" },
        {
            $lookup: {
                from: "params",
                let: { productId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$productId", "$$productId"],
                            },
                        },
                    },
                    {
                        $project: {
                            slug: 0,
                            __v: 0,
                            productId: 0,
                        },
                    },

                    {
                        $lookup: {
                            from: "productimages",
                            let: { paramId: "$_id" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ["$paramId", "$$paramId"],
                                        },
                                    },
                                },
                                {
                                    $project: {
                                        image: 1,
                                    },
                                },
                            ],
                            as: "images",
                        },
                    },
                    {
                        $lookup: {
                            from: "sizes",
                            let: { paramId: "$_id" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ["$paramId", "$$paramId"],
                                        },
                                    },
                                },
                                {
                                    $project: {
                                        price: 1,
                                        size: 1,
                                        count: 1,
                                    },
                                },
                            ],
                            as: "sizes",
                        },
                    },
                ],
                as: "params",
            },
        },
        ...aggregateEnd,
        // {
        //     $project: {
        //         _id: 0,
        //         name: 1,
        //         category: 1,
        //         shop: 1,
        //         slug: 1,
        //         param: {
        //             $let: {
        //                 vars: {
        //                     param: { $arrayElemAt: ["$params", 0] },
        //                 },
        //                 in: {
        //                     $let: {
        //                         vars: {
        //                             sizes: "$$param.sizes",
        //                             images: "$$param.images",
        //                         },
        //                         in: {
        //                             sizes: { $arrayElemAt: ["$$sizes", 0] },
        //                             images: { $arrayElemAt: ["$$images", 0] },
        //                         },
        //                     },
        //                 },
        //             },
        //         },
        //     },
        // },
        // {
        //     $project: {
        //         name: 1,
        //         category: 1,
        //         slug: 1,
        //         price: "$param.sizes.price",
        //         image: "$param.images.image",
        //     },
        // },
    ]).exec(async (err, data) => {
        if (err) return res.status(400).json({ success: false, err });
        const resData = [];
        let items = {};
        data.forEach((element, index) => {
            items.brands[`${element.brand.name}`] = "";
            element.params &&
                element.params.forEach((key) => {
                    items.colors[`${key.color}`] = "";
                    key.sizes &&
                        key.sizes.forEach((key) => {
                            items.sizes[`${key.color}`] = "";
                        });
                });

            if (
                (page - 1) * limit <= index &&
                index < (page - 1) * limit + limit
            ) {
                if (element) {
                    resData.push(element);
                }
            }
        });

        res.status(200).json({
            success: true,
            data: resData,
            items,
            num,
        });
    });
};
exports.getAll = async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const num = await Product.countDocuments();
    await Product.aggregate([
        { $sort: { createdAt: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        {
            $lookup: {
                from: "categories",
                let: { category: "$category" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$_id", "$$category"] } } },
                    { $project: { name: 1, _id: 0 } },
                ],
                as: "category",
            },
        },
        { $unwind: "$category" },
        {
            $lookup: {
                from: "sizes",
                let: { productId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$productId", "$$productId"] },
                        },
                    },
                    { $project: { price: 1, _id: 0 } },
                ],
                as: "sizes",
            },
        },
        {
            $lookup: {
                from: "productimages",
                let: { productId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$productId", "$$productId"] },
                        },
                    },
                    { $project: { image: 1, _id: 0 } },
                ],
                as: "images",
            },
        },
        {
            $project: {
                _id: 0,
                name: 1,
                category: 1,
                slug: 1,
                price: {
                    $let: {
                        vars: {
                            size: { $arrayElemAt: ["$sizes", 0] },
                        },
                        in: "$$size.price",
                    },
                },
                image: {
                    $let: {
                        vars: {
                            image: { $arrayElemAt: ["$images", 0] },
                        },
                        in: "$$image.image",
                    },
                },
            },
        },
    ]).exec((err, data) => {
        if (err) return res.status(400).json({ success: false, err });
        res.status(200).json({ success: true, data, num });
    });
};

exports.getOne = async (req, res) => {
    await Product.aggregate([
        { $match: { slug: req.params.slug } },
        {
            $lookup: {
                from: "brands",
                let: { brand: "$brand" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$_id", "$$brand"] } } },
                    { $project: { name: 1, slug: 1, _id: 1 } },
                ],
                as: "brand",
            },
        },
        { $unwind: "$brand" },
        {
            $lookup: {
                from: "categories",
                let: { category: "$category" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$_id", "$$category"] } } },
                    { $project: { __v: 0, createdAt: 0, updatedAt: 0 } },
                ],
                as: "category",
            },
        },
        { $unwind: "$category" },
        {
            $lookup: {
                from: "shops",
                let: { shop: "$shop" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$_id", "$$shop"] } } },
                    {
                        $project: {
                            shopName: 1,
                        },
                    },
                ],
                as: "shop",
            },
        },
        {
            $project: {
                slug: 0,
                createdAt: 0,
                updatedAt: 0,
                __v: 0,
            },
        },
        { $unwind: "$shop" },
        {
            $lookup: {
                from: "params",
                let: { productId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$productId", "$$productId"],
                            },
                        },
                    },
                    {
                        $project: {
                            slug: 0,
                            __v: 0,
                            productId: 0,
                        },
                    },

                    {
                        $lookup: {
                            from: "productimages",
                            let: { paramId: "$_id" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ["$paramId", "$$paramId"],
                                        },
                                    },
                                },
                                {
                                    $project: {
                                        image: 1,
                                    },
                                },
                            ],
                            as: "productImages",
                        },
                    },
                    {
                        $lookup: {
                            from: "sizes",
                            let: { paramId: "$_id" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ["$paramId", "$$paramId"],
                                        },
                                    },
                                },
                                {
                                    $project: {
                                        price: 1,
                                        size: 1,
                                        count: 1,
                                    },
                                },
                            ],
                            as: "sizes",
                        },
                    },
                ],
                as: "params",
            },
        },
    ]).exec((err, data) => {
        if (err) return res.status(400).json({ success: false, err });
        res.status(200).json({ success: true, data });
    });
};

exports.edit = (req, res) => {
    Product.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body })
        .then((data) => {
            if (!data) {
                return res.status(404).json({
                    message: "Product not found with id " + req.params.id,
                });
            }
            res.status(200).json({ success: true });
        })
        .catch((err) => {
            if (err.kind === "ObjectId") {
                return res.status(404).json({
                    message: "Product not found with id " + req.params.id,
                });
            }
            return res.status(500).json({
                message:
                    "Something wrong updating note with id " + req.params.id,
            });
        });
};

exports.delete = (req, res) => {
    Product.findByIdAndRemove({ _id: req.params.id })
        .then(async (product) => {
            if (!product) {
                return res.status(404).json({
                    message: "Product not found with id " + req.params.id,
                });
            }
            res.json({ message: "Product deleted successfully!" });

            await Size.deleteMany({ productId: _id }).exec((err, data) => {
                console.log("size", err, data);
            });
            await ProductImage.deleteMany({ productId: _id }).exec(
                (err, data) => {
                    console.log("productImage", err, data);
                }
            );
            await Param.deleteMany({ productId: _id }).exec((err, data) => {
                console.log("param", err, data);
            });
        })
        .catch((err) => {
            if (err.kind === "ObjectId" || err.name === "NotFound") {
                return res.status(404).json({
                    message: "Product not found with id " + req.params.id,
                });
            }
            return res.status(500).json({
                message: "Could not delete product with id " + req.params.id,
            });
        });
};

exports.editParam = async (req, res) => {
    await Param.updateOne({ _id: req.params.id }, { $set: req.body }).exec(
        (err, data) => {
            if (err) return res.status(400).json({ success: false, data: err });
            return res.status(200).json({ success: true, data: data });
        }
    );
};

exports.editSize = async (req, res) => {
    await Size.updateOne({ _id: req.params.id }, { $set: req.body }).exec(
        (err, data) => {
            if (err) return res.status(400).json({ success: false, data: err });
            return res.status(200).json({ success: true, data: data });
        }
    );
};
exports.deleteParam = async (req, res) => {
    await Param.findByIdAndDelete({ _id: req.params.id });
    res.status(200).json({
        success: true,
        data: [],
    });
};
exports.deleteSize = async (req, res) => {
    await Size.findByIdAndDelete({ _id: req.params.id });
    res.status(200).json({
        success: true,
        data: [],
    });
};

exports.deleteImage = async (req, res) => {
    await ProductImage.findOne({ _id: req.params.id }, async (err, data) => {
        if (err) throw console.log(err);
        fs.unlink(
            path.join(path.dirname(__dirname) + `/public${data.image}`),
            (err) => {
                if (err) throw console.log(err);
            }
        );
        await ProductImage.findByIdAndDelete({ _id: data._id });
        res.status(200).json({
            success: true,
            data: [],
        });
    });
};
