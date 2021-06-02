const {Brand, validate} = require("../models/brand");
const { getSlug } = require("../utils");
const fs = require("fs");
const path = require("path");
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
    return res.status(200).json({success: true, data: await Brand.find()})
}
exports.getOne = async (req, res) => {
    if (!req.params.slug) {
        return res.status(400).json({success: false, data:[]})
    }
    res.status(200).json({success: true, data: await Brand.findOne({slug: req.params.slug})})
}
exports.edit = (req, res) => { }
exports.editImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({success: false, message: "File don't upload"})
    }
    const img = {
        image: `/uploads/brands/${req.file.filename}`
    }
    Brand.findOne({ _id: req.params.id }).then(data => {
        fs.unlink(
            path.join(path.dirname(__dirname)+`/public${data.image}`),
            (err)=>{
                if(err) res.status(400).json({success: false, err});
            }
        )
    }).catch(err => {
        fs.unlink(
            path.join(path.dirname(__dirname)+`/public${img.image}`),
            (err)=>{
                if(err) res.status(400).json({success: false, err});
            }
        )
        res.status(400).json({success: false, err});
    })
    
    Brand.updateOne({_id: req.params.id},{$set: img})
    .exec((err,data)=>{
        if(err) return res.status(400).json({success: false,err})
        res.status(200).json({success: true, data})
    })
}
exports.delete = async (req, res) => {
    await Brand.findById({ _id: req.params.id }, async (err, data) => {
        if (err) {
            res.status(400).json({success: false, err})
        }
        fs.unlink(
            path.join(path.dirname(__dirname), `/public${data.image}`),
            (err) => {
                return res.status(400).json({success: false, err})
            }
        )
    })
    Brand.findByIdAndDelete({ _id: req.params.id })
    res.status(200).json({success: true, data: []})
}