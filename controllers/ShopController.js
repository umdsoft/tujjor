const Shop = require("../models/shop");
const User = require("../models/user");
const Product = require("../models/product");
const { getSlug, deleteFile, getText } = require("../utils");
const { deleteProductByShop, updateStatusByShop } = require("../utils/preModel");

//for Admin
exports.getShops = async (req, res) => {
    res.status(200).json({
        success: true,
        data: await Shop.find({ status: { $gte: 1 }, isDelete: false }).select({ __v: 0, isDelete: 0}),
    });
};
exports.getContracts = async (req, res) => {
    res.status(200).json({
        success: true,
        data: await Shop.find({ status: 0, isDelete: false })
            .populate([{ path: "user", select: { name: 1, phone: 1, _id: 0 } }])
            .select({ __v: 0, isDelete: 0 }),
    });
};
exports.getOneAdmin = async (req, res) => {
    await Shop.findById({ _id: req.params.id })
        .select({ user: 0, __v: 0 })
        .then((data) => {
            if (!data) {
                return res
                    .status(404)
                    .json({ success: false, message: "Not found this shop" });
            }
            return res.status(200).json({ success: true, data });
        })
        .catch((err) => {
            return res.status(500).json({ success: false, message: err });
        });
};
exports.updateItems = async (req, res) => {
    if (!req.body || !req.body.category.length) {
        return res.status(400).json({ success: false, data: "Something went wrong" });
    }
    await Shop.findOneAndUpdate(
        { _id: req.params.id },
        { $set: {category: req.body.category, percent: req.body.percent || 0 } },
        { 
            new: true, 
            fields: { isDelete: 0, __v: 0 }
        },
        async (err, data) => {
            if (err) {
                return res.status(400).json({ success: false, data: "Not Found" });
            }
            res.status(200).json({ success: true, data });
        }
    );
}
exports.editStatus = async (req, res) => {
    if (!req.body || !req.body.category || !req.body.percent) {
        return res.status(400).json({ success: false, data: "Something went wrong" });
    }
    const count = Shop.countDocuments({status: {$gte: 1}})
    await Shop.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { status: 1, category: req.body.category, percent: req.body.percent, code: getText(count + 1, 3) } },
        { new: true, fields: { isDelete: 0, __v: 0 } },
        async (err, data) => {
            if (err) {
                return res.status(400).json({ success: false, data: "Not Found" });
            }
            await User.findOneAndUpdate({ _id: data.user }, { $set: { role: "seller" } });
            res.status(200).json({ success: true, data });
        }
    );
};
exports.editToSeeProducts = async (req, res) => {
    if (!(req.body.status === 1 || req.body.status === 2)) {
        return res.status(400).json({ success: false, data: "Something went wrong" });
    }
    await Shop.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: { status: req.body.status } },
        { new: true, fields: { isDelete: 0, __v: 0 } },
        async (err, data) => {
            if (err) {
                return res.status(400).json({ success: false, data: "Not Found" });
            }
            if (data) {
                Product.updateMany(
                    { shop: data._id },
                    { $set: { shopIsActive: req.body.status === 2 ? 1 : 0 } }
                )
            }
            res.status(200).json({ success: true, data });
        }
    );
};

// for Seller
exports.getOne = async (req, res) => {
    await Shop.findOne({ user: req.user })
        .select({ user: 0, __v: 0 })
        .then((data) => {
            if (!data) {
                return res
                    .status(404)
                    .json({ success: false, message: "Not found this shop" });
            }
            return res.status(200).json({ success: true, data });
        })
        .catch((err) => {
            return res.status(500).json({ success: false, message: err });
        });
};
exports.edit = async (req, res) => {
    if (req.body.status || req.body.category) {
        return res.status(400).json({ success: false, message: "Something went wrong" });
    }
    await Shop.findOneAndUpdate(
        { user: req.user },
        { $set: req.body },
        { new: true },
        (err, data) => {
            if (err) {
                return res.status(400).json({ success: false, err });
            }
            res.status(200).json({ success: true, data });
        }
    );
};
exports.imageUpload = async (req, res) => {
    const image = `/uploads/shops/${req.file.filename}`;
    res.status(201).json({ success: true, image });
};

//for client
exports.create = async (req, res) => {
    const shop = new Shop({
        fullNameDirector: req.body.fullNameDirector,
        shopName: req.body.shopName,
        shopId: req.body.shopId,
        address: req.body.address,
        phone: req.body.phone,
        bankName: req.body.bankName,
        inn: req.body.inn,
        email: req.body.email,
        user: req.body.user,
        image: req.files.image ? `/uploads/shops/${req.files.image[0].filename}` : "",
        description: {
            uz: req.body.description ? req.body.description.uz : "",
            ru: req.body.description ? req.body.description.ru : "",
        },
        category: ["Not Selected"],
        slug: req.body.shopName ? getSlug(req.body.shopName) : "",
        fileContract: `/uploads/shops/${req.files.fileContract[0].filename}`,
        fileCertificate: `/uploads/shops/${req.files.fileCertificate[0].filename}`,
    });
    shop.save()
        .then(() => {
            res.status(200).json({ success: true, data: shop });
        })
        .catch((err) => {
            Object.keys(req.files).forEach((key) => {
                deleteFile(`/public/uploads/shops/${req.files[key][0].filename}`);
            });
            res.status(400).json({ success: false, err });
        });
};
exports.getShopsClient = async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    Shop.aggregate([
        {
            $match: {
                status: 2, isDelete: false
            }
        },
        {
            $project: {
                _id: 0,
                address: 1,
                shopName: 1,
                phone: 1,
                image: 1,
                slug: 1,
                description: 1,
            }
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
    ]).exec((err,data)=>{
        if(err) return res.status(400).json({ success: false, err })
        res.status(200).json({success: true, data})
    })
};
exports.getOneClient = async (req, res) => {
    await Shop.findOne({ slug: req.params.slug, status: 2, isDelete: false })
        .select({ shopName: 1, address: 1, phone: 1, email: 1, description: 1, image: 1, logo: 1, logotip: 1 })
        .then((data) => {
            if (!data) {
                return res
                    .status(404)
                    .json({ success: false, message: "Not found this shop" });
            }
            return res.status(200).json({ success: true, data });
        })
        .catch((err) => {
            return res.status(500).json({ success: false, message: err });
        });
};
exports.delete = async (req, res) => {
    await Shop.findOne({ _id: req.params.id }, async (err, data) => {
        if (err || !data) {
            return res.status(404).json({ success: false, message: "Not Found this Id" });
        }
        if(data.status === 0){
            deleteFile(`/public${data.fileContract}`);
            deleteFile(`/public${data.fileCertificate}`);
            deleteFile(`/public${data.image}`);
            deleteProductByShop(data._id);
            await Shop.findByIdAndDelete({ _id: data._id }, async (err, data) => {
                if (data) {
                    await User.findOneAndUpdate(
                        { _id: data.user },
                        { $set: { role: "client" } }
                    );
                }
            });
        } else {
            await Shop.findByIdUpdate({ _id: data._id }, {$set: {isDelete: true}}, async (err, data) => {
                if (data) {
                    updateStatusByShop(data._id)
                    await User.findOneAndUpdate(
                        { _id: data.user },
                        { $set: { role: "client" } }
                    );
                }
            });
        }
        res.status(200).json({
            success: true,
            data: [],
        });
    });
};
