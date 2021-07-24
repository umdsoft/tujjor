const Brand = require("../models/brand");
const sharp = require("sharp");
const path = require("path");
const { getSlug, deleteFile } = require("../utils");
const { deleteProduct } = require("../utils/preModel");
exports.create = async (req, res) => {
    const { filename } = req.file;
    await sharp(path.join(path.dirname(__dirname) + `/public/temp/${filename}`))
        .resize(150, 150)
        .jpeg({
            quality: 60,
        })
        .toFile(
            path.join(path.dirname(__dirname) + `/public/uploads/brands/${filename}`),
            (err) => {
                if (err) {
                    console.log(err);
                }
                deleteFile(`/public/temp/${filename}`);
            }
        );
    const brand = new Brand({
        name: req.body.name,
        slug: getSlug(req.body.name),
        category: req.body.category,
        image: `/uploads/brands/${filename}`,
    });
    brand
        .save()
        .then(() => {
            return res.status(200).json({ success: true, data: brand });
        })
        .catch((err) => {
            deleteFile(`/public/uploads/brands/${filename}`);
            return res.status(400).json({ success: false, err });
        });
};
exports.getAll = async (req, res) => {
    return res
        .status(200)
        .json({ success: true, data: await Brand.find().populate("category") });
};
exports.getAllClient = async (req, res) => {
    return res
        .status(200)
        .json({ success: true, data: await Brand.find({}, { name: 1 }) });
};
exports.getOne = async (req, res) => {
    if (!req.params.slug) {
        return res.status(400).json({ success: false, data: [] });
    }
    res.status(200).json({
        success: true,
        data: await Brand.findOne({ slug: req.params.slug }).populate("category"),
    });
};
exports.edit = async (req, res) => {
    await Brand.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { new: true },
        async (err, data) => {
            if (err) {
                return res.status(400).json({ success: false, err });
            }
            res.status(200).json({ success: true, data });
        }
    );
};
exports.editImage = async (req, res) => {
    const img = { image: `/uploads/brands/${req.file.filename}` };
    Brand.findByIdAndUpdate({ _id: req.params.id }, { $set: img }).exec((err, data) => {
        if (err) return res.status(400).json({ success: false, err });
        deleteFile(`/public${data.image}`);
        return res.status(200).json({ success: true, data });
    });
};
exports.delete = async (req, res) => {
    await Brand.findByIdAndDelete({ _id: req.params.id }, (err, data) => {
        if (err) return res.status(400).json({ success: false, err });
        deleteFile(`/public${data.image}`);
        deleteProduct(data._id, "brand");
        res.status(200).json({ success: true, data: [] });
    });
};
