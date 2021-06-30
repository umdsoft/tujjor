const mongoose = require("mongoose");

const Product = require("../models/product");
const Param = require("../models/param");
const Size = require("../models/size");
const ProductImage = require("../models/productImage");
const FooterImage = require("../models/footerImage");
const { getSlug, deleteFile } = require("../utils");
const {
    sharpFrontImage,
    sharpParamImage,
    sharpProductImage,
    sharpFooterImage,
} = require("../utils/product");

const deleteParam = (id) => {
    Param.findOneAndDelete({ productId: id }).then((param) => {
        if (param) {
            deleteFile(`/public${param.image}`);
        } else {
            deleteParam(id);
        }
    });
};
const deleteSizeByProduct = (id) => {
    Size.deleteMany({ productId: id });
};
const deleteSizeByParam = (id) => {
    Size.deleteMany({ paramId: id });
};
const deleteImage = (id) => {
    ProductImage.findOneAndDelete({ productId: id }).then((image) => {
        if (image) {
            deleteFile(`/public${image.image}`);
        } else {
            deleteImage(id);
        }
    });
};
const deleteFooterImage = (id) => {
    FooterImage.findOneAndDelete({ productId: id }).then((image) => {
        if (image) {
            deleteFile(`/public${image.image}`);
        } else {
            deleteFooterImage(id);
        }
    });
};

//create
exports.create = async (req, res) => {
    const { filename } = req.file;
    sharpFrontImage(filename);
    const product = new Product({
        name: {
            uz: req.body.name ? req.body.name.uz : "",
            ru: req.body.name ? req.body.name.ru : "",
        },
        shop: req.body.shop,
        category: req.body.category,
        brand: req.body.brand,
        description: {
            uz: req.body.description ? req.body.description.uz : "",
            ru: req.body.description ? req.body.description.ru : "",
        },
        image: `/uploads/products/cards/${filename}`,
        article: req.body.article,
        tags: req.body.tags || "",
        slug: getSlug(req.body.name ? req.body.name.ru : ""),
        status: 0,
    });
    product
        .save()
        .then((data) => {
            res.status(200).json({
                success: true,
                data: { _id: data._id },
            });
        })
        .catch((err) => {
            res.status(500).json({
                message:
                    err.message ||
                    "Something wrong while creating the product.",
            });
        });
};
exports.createParam = async (req, res) => {
    const { filename } = req.file;
    sharpParamImage(filename);
    const param = new Param({
        image: `/uploads/products/colors/${filename}`,
        productId: req.body.productId,
    });
    param
        .save()
        .then((data) => {
            res.status(200).json({ success: true, data: { _id: data._id } });
        })
        .catch((err) => {
            deleteFile(`/public/temp/${filename}`);
            deleteFile(`/public/uploads/products/colors/${filename}`);
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
exports.createImage = async (req, res) => {
    const { filename } = req.file;
    sharpProductImage(filename);

    const image = new ProductImage({
        productId: req.body.productId,
        image: `/uploads/products/${filename}`,
        smallImage: `/uploads/products/smalls/${filename}`,
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

exports.createFooterImage = async (req, res) => {
    const { filename } = req.file;
    sharpFooterImage(filename);
    const image = new FooterImage({
        productId: req.body.productId,
        image: `/uploads/products/footer/${filename}`,
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

//Edit
exports.edit = (req, res) => {
    const { filename } = req.file;
    sharpFrontImage(filename);
    Product.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: { ...req.body, image: `/uploads/products/cards/${filename}` } }
    )
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

exports.editParam = async (req, res) => {
    const { filename } = req.file;
    sharpParamImage(filename);
    await Param.updateOne(
        { _id: req.params.id },
        { $set: { image: `/uploads/products/colors/${filename}` } },
        { new: true }
    ).exec((err, data) => {
        if (err) return res.status(400).json({ success: false, data: err });
        deleteFile(`public${data.image}`);
        return res.status(200).json({ success: true, data: data });
    });
};
exports.editSize = async (req, res) => {
    await Size.updateOne({ _id: req.params.id }, { $set: req.body }).exec(
        (err, data) => {
            if (err) return res.status(400).json({ success: false, data: err });
            return res.status(200).json({ success: true, data: data });
        }
    );
};

// Delete
exports.delete = (req, res) => {
    Product.findByIdAndDelete({ _id: req.params.id })
        .then((product) => {
            if (!product) {
                return res.status(404).json({
                    message: "Product not found with id " + req.params.id,
                });
            }
            deleteFile(`/public${product.image}`);
            deleteParam(product._id);
            deleteSizeByProduct(product._id);
            deleteImage(product._id);
            deleteFooterImage(product._id);
            res.json({ message: "Product deleted successfully!" });
        })
        .catch((err) => {
            console.log("Product Delete Error ... ", err);
            res.status(500).json({ message: err });
        });
};
exports.deleteParam = async (req, res) => {
    await Param.findByIdAndDelete({ _id: req.params.id }).then((param) => {
        deleteSizeByParam(param._id);
    });
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
    await ProductImage.findByIdAndDelete({ _id: req.params.id }).then(
        (image) => {
            deleteFile(`/public${image.image}`);
        }
    );
    res.status(200).json({
        success: true,
        data: [],
    });
};
exports.deleteFooterImage = async (req, res) => {
    await FooterImage.findByIdAndDelete({ _id: req.params.id }).then(
        (image) => {
            deleteFile(`/public${image.image}`);
        }
    );
    res.status(200).json({
        success: true,
        data: [],
    });
};

// Get
//price , category, brand, color, size, tags,
exports.filter = async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    if (page === 0 || limit === 0) {
        return res
            .status(400)
            .json({ success: false, message: "Error page or limit" });
    }
    let aggregateStart = [];
    let aggregateSearch = [];
    let aggregateEnd = [];
    if (req.body.search && req.body.search.length) {
        aggregateSearch.push({
            $match: {
                $or: [
                    {
                        "name.uz": {
                            $regex: `.*${req.body.search}.*`,
                            $options: "i",
                        },
                    },
                    {
                        "name.ru": {
                            $regex: `.*${req.body.search}.*`,
                            $options: "i",
                        },
                    },
                    {
                        "brand.name": {
                            $regex: `.*${req.body.search}.*`,
                            $options: "i",
                        },
                    },
                    {
                        "category.name.uz": {
                            $regex: `.*${req.body.search}.*`,
                            $options: "i",
                        },
                    },
                    {
                        "category.name.ru": {
                            $regex: `.*${req.body.search}.*`,
                            $options: "i",
                        },
                    },
                    {
                        "description.uz": {
                            $regex: `.*${req.body.search}.*`,
                            $options: "i",
                        },
                    },
                    {
                        "description.ru": {
                            $regex: `.*${req.body.search}.*`,
                            $options: "i",
                        },
                    },
                    {
                        "tags.name": {
                            $regex: `.*${req.body.search}.*`,
                            $options: "i",
                        },
                    },
                ],
            },
        });
    }

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
    if (req.body.start && req.body.start != 0) {
        aggregateEnd.push({
            $match: {
                price: {
                    $gte: parseInt(req.body.start),
                },
            },
        });
    }
    if (req.body.end && req.body.end != 0) {
        aggregateEnd.push({
            $match: {
                price: {
                    $lte: parseInt(req.body.end),
                },
            },
        });
    }
    if (req.body.sort) {
        switch (req.body.sort) {
            case "new": {
                aggregateStart.push({
                    $sort: {
                        createdAt: -1,
                    },
                });
                break;
            }
            case "popular": {
                aggregateEnd.push({
                    $sort: {
                        count: -1,
                    },
                });
                break;
            }

            case "priceUp": {
                aggregateEnd.push({
                    $sort: {
                        price: 1,
                    },
                });
                break;
            }

            case "priceDown": {
                aggregateEnd.push({
                    $sort: {
                        price: -1,
                    },
                });
                break;
            }
            default: {
            }
        }
    }
    await Product.aggregate([
        ...aggregateStart,
        {
            $lookup: {
                from: "tags",
                localField: "tags",
                foreignField: "_id",
                as: "tags",
            },
        },
        { $project: { "tags.__v": 0, "tags._id": 0 } },
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
                from: "brands",
                let: { brand: "$brand" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$_id", "$$brand"] } } },
                    { $project: { name: 1 } },
                ],
                as: "brand",
            },
        },
        { $unwind: "$brand" },
        ...aggregateSearch,
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
                    {
                        $sort: { price: 1 },
                    },
                ],
                as: "sizes",
            },
        },
        {
            $project: {
                name: 1,
                category: "$category.name",
                image: 1,
                brand: 1,
                slug: 1,
                price: {
                    $let: {
                        vars: {
                            size: { $arrayElemAt: ["$sizes", 0] },
                        },
                        in: "$$size.price",
                    },
                },
            },
        },
        ...aggregateEnd,
        {
            $facet: {
                brands: [
                    {
                        $group: {
                            _id: null,
                            brands: {
                                $addToSet: "$brand._id",
                            },
                        },
                    },
                ],
                count: [{ $group: { _id: null, count: { $sum: 1 } } }],
                data: [
                    { $skip: (page - 1) * limit },
                    { $limit: limit },
                    { $project: { brand: 0 } },
                ],
            },
        },
        {
            $project: {
                data: 1,
                count: {
                    $let: {
                        vars: {
                            count: { $arrayElemAt: ["$count", 0] },
                        },
                        in: "$$count.count",
                    },
                },
                brands: {
                    $let: {
                        vars: {
                            brands: { $arrayElemAt: ["$brands", 0] },
                        },
                        in: "$$brands.brands",
                    },
                },
            },
        },
    ]).exec(async (err, data) => {
        if (err) return res.status(400).json({ success: false, err });
        res.status(200).json({
            success: true,
            data: data[0].data,
            brands: data[0].brands,
            count: Math.ceil(data[0].count / limit),
        });
    });
};
exports.getAll = async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    await Product.aggregate([
        { $match: { shop: mongoose.Types.ObjectId(req.query.shop) } },
        { $sort: { createdAt: -1 } },
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
                    {
                        $sort: { price: 1 },
                    },
                ],
                as: "sizes",
            },
        },
        {
            $project: {
                name: 1,
                image: 1,
                category: "$category.name",
                slug: 1,
                price: {
                    $let: {
                        vars: {
                            size: { $arrayElemAt: ["$sizes", 0] },
                        },
                        in: "$$size.price",
                    },
                },
            },
        },
        {
            $facet: {
                count: [{ $group: { _id: null, count: { $sum: 1 } } }],
                data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
            },
        },
        {
            $project: {
                count: {
                    $let: {
                        vars: {
                            count: { $arrayElemAt: ["$count", 0] },
                        },
                        in: "$$count.count",
                    },
                },
                data: 1,
            },
        },
    ]).exec((err, data) => {
        if (err) return res.status(400).json({ success: false, err });
        res.status(200).json({
            success: true,
            data: data[0].data,
            count: data[0].count,
        });
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
        { $unwind: "$shop" },
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
                    {
                        $project: { productId: 0 },
                    },
                ],
                as: "images",
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
                    {
                        $project: { productId: 0 },
                    },
                ],
                as: "foterImages",
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
