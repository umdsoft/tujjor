const {Brand, validate} = require("../models/brand");
const { getSlug } = require("../utils");
const fs = require("fs");
const path = require("path");
exports.create = (req, res) => {
    if(!Object.keys(req.body).length){
        return res.status(400).json({success: false, message: 'Required !'})
    }
    const { error } = validate(req.body);
    if (error) return res.status(400).json({success: false, message: error.details[0].message});
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
    return res.status(200).json({success: true, data: await Brand.find().populate('category')})
}
exports.getOne = async (req, res) => {
    if (!req.params.slug) {
        return res.status(400).json({success: false, data:[]})
    }
    res.status(200).json({success: true, data: await Brand.findOne({slug: req.params.slug}).populate('category')})
}
exports.edit = async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).json({success: false, message: error.details[0].message});
    await Brand.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body }, async (err, data) => {
        if (err) {
            return res.status(400).json({success: false, err})
        }
        await res.status(200).json({success: true})
    })
}
exports.editImage = async (req, res) => {
    const img = { image: `/uploads/brands/${req.file.filename}` }
    await Brand.findById({_id: req.params.id },async (err,data)=> {
        if (err) return res.status(200).json({success: false, err});
        fs.unlink(
            path.join(path.dirname(__dirname) + `/public${data.image}`),
            (err) => {
                if (err) return res.status(400).json({success: false, err});
            }
        )
    })
    await Brand.findByIdAndUpdate({_id: req.params.id},{$set: img})
    .exec((err,data)=>{
        if(err) return res.status(400).json({success: false,err})
        return res.status(200).json({success: true, data})
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
                if (err) return res.status(400).json({success: false, err});
            }
        )
    })
    await Brand.findByIdAndDelete({ _id: req.params.id }, (err, data)=>{
        if(err) return res.status(400).json({success: false, err})
        res.status(200).json({success: true, data: []})
    })
}