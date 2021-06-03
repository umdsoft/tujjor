const { News, validate } = require('../models/news');
const { getSlug } = require('../utils');
const fs = require('fs');
const path = require('path');

exports.create = (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).json({success: false, message: error.details[0].message});
    if (!req.file) {
        return res.status(400).json({success: false, message: "File don't upload"})
    }
    const filePath = req.file.mimetype.startsWith('video') ? 'videos' : 'images';
    const news = new News({
        title: {
            uz: req.body.title.uz,
            ru: req.body.title.ru
        },
        description: {
            uz: req.body.description.uz,
            ru: req.body.description.ru
        },
        file: `/uploads/news/${filePath}/${req.file.filename}`,
        status: req.body.status,
        slug: getSlug(req.body.title.ru),
        type: req.file.mimetype.startsWith('video') ? 'video' : 'image'
    })
    news.save().then(() => {
        return res.status(200).json({success: true, data: news})
    }).catch(err => {
        return res.status(400).json({success: false, err})
    })
}
exports.getAll = async (req, res) => {
    return res.status(200).json({success: true, data: await News.find()})
}
exports.getOne = async (req, res) => {
    res.status(200).json({success: true, data: await News.findOne({slug: req.params.slug})})
}
exports.getType = async (req, res) => {
    console.log(req)
    res.status(200).json({success: true, data: req})
}
exports.edit = async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).json({success: false, message: error.details[0].message})
    }
    await News.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body }, (err, data) => {
        if (err) {
            return res.status(400).json({success: false, err})
        }
        return res.status(200).json({success: true})
    })
}
exports.editFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({success: false, message: "File don't upload"})
    }
    const filePath = req.file.mimetype.startsWith('video') ? 'videos' : 'images';
    const file = {
        file: `/uploads/news/${filePath}/${req.file.filename}`,
        type: req.file.mimetype.startsWith('video') ? 'video' : 'image'
    }
    await News.findOne({_id: req.params.id },async (err,data)=> {
        if (err) return res.status(200).json({success: false, err});
        fs.unlink(
            path.join(path.dirname(__dirname)+`/public${data.file}`),
            (err)=>{
                if(err) res.status(400).json({success: false, err});
            }
        )
    })
    
    News.updateOne({_id: req.params.id},{$set: file})
        .exec((err,data)=>{
            if(err) return res.status(400).json({success: false,err})
            res.status(200).json({success: true, data})
        })
}
exports.delete = async (req, res) => {
    await News.findOne({ _id: req.params.id }, async (err, data) => {
        if (err) { return res.status(400).json({ success: false, err }) }
        console.log(data)

        fs.unlink(
            path.join(path.dirname(__dirname)+`/public${data.file}`),
            (err)=>{
                if(err) res.status(400).json({success: false, err});
            }
        )
        await News.findByIdAndDelete(data._id)
        res.status(200).json({
            success: true,
            data: []
        })
    })
}