const News = require('../models/news');
const { getSlug } = require('../utils');
const fs = require('fs');
const path = require('path');

exports.create = (req, res) => {
    if(!Object.keys(req.body).length){
        return res.status(400).json({success: false, message: 'Required !'})
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
        startTime: ISODate(req.body.startTime),
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
    await News.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body }, (err, data) => {
        if (err) {
            return res.status(400).json({success: false, err})
        }
        return res.status(200).json({success: true})
    })
}
exports.editFile = async (req, res) => {
    const filePath = req.file.mimetype.startsWith('video') ? 'videos' : 'images';
    const file = {
        file: `/uploads/news/${filePath}/${req.file.filename}`,
        type: req.file.mimetype.startsWith('video') ? 'video' : 'image'
    }
    await News.findOne({_id: req.params.id },async (err,data)=> {
        if (err) return res.status(200).json({success: false, err});
        fs.unlink(
            path.join(path.dirname(__dirname)+`/public${data.file}`),
            (err) => {
                if (err) return res.status(400).json({success: false, err});
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
        if(!data) {
            return res.status(404).json({success: false, message: "News not found with id "+ req.params.id})
        }
        fs.unlink(
            path.join(path.dirname(__dirname)+`/public${data.file}`),
            (err) => {
                if (err) return res.status(400).json({success: false, err});
            }
        )
        await News.findByIdAndDelete({_id: data._id})
        res.status(200).json({success: true, data: [] })
    })
}

exports.getClientAll = async (req, res) =>{
    return res.status(200).json({success: true, data: await News.find(
        { startTime: {$gte: Date.now()}}
    )})
}