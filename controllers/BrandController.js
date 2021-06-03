const {Brand, validate} = require("../models/brand");
const { getSlug } = require("../utils");

exports.create = (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).json({success: false, message: error.details[0].message});
    if (!req.file) {
        return res.status(400).json({success: false, message: "File don't upload"})
    }
    const brand = new Brand({
        name: req.body.name,
        slug: getSlug(req.body.name),
        category: req.body.category,
        image: `/uploads/brands/${req.file.filename}`,
    })
    brand.save()
        .then(() => {
        return res.status(200).json({success: true, data: brand})
    })
        .catch(err => {
        return res.status(400).json({success: false, err})
    })
}
exports.getAll = async (req, res) => {
    res.status(200).json({success: true, data: await Brand.find({},{__v: 0})})
}
exports.getOne = (req, res)=>{}
exports.edit = (req, res)=>{}
exports.delete = (req, res)=>{}