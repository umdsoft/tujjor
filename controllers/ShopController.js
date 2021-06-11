const Shop = require('../models/shop');
const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const { getSlug, deleteFile } = require('../utils');

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
        image: req.files.image? `/uploads/shops/${req.files.image[0].filename}`: "",
        description: {
            uz: req.body.description?.uz || "",
            ru: req.body.description?.ru || ""
        },
        category: req.body.category || "Not selected",
        slug: req.body.shopName? getSlug(req.body.shopName): "",
        fileContract:  `/uploads/shops/${req.files.fileContract[0].filename}`,
        fileCertificate : `/uploads/shops/${req.files.fileCertificate[0].filename}`,
    })
    shop.save()
    .then(()=>{
        res.status(200).json({success:true, data: shop})
    })
    .catch(err=>{
        Object.keys(req.files).forEach(key=>{
            deleteFile(path.join(path.dirname(__dirname) + `/public/uploads/shops/${req.files[key][0].filename}`))
        })
        res.status(400).json({success:false, err})
    })
}
exports.getShop = async (req, res) => {
    res.status(200).json({success: true, data: await Shop.find({}).populate('category').select({__v: 0})
})
}
exports.getOne = async (req, res) => {
    await Shop.findOne({user: req.params.user}).select({user: 0, __v: 0})
    .then(data => {
        return res.status(200).json({success: true, data})
    }).catch(err => {
        return res.status(500).json({success: false, message: err})
    })
}
exports.editStatus = async (req, res)=>{
    if(!req.body){
        return res.status(400).json({success: false, data: 'Something is wrong'})
    }
    await Shop.updateOne({_id: req.params.id},{$set: {status: req.body.status}}, (err, data)=>{
        if(err){
            return res.status(400).json({success: false, data: 'Not Found'})
        }
            console.log()
            User.updateOne({_id: data.user}, {$set: {role: (req.body.status === 0)?"client":"seller"}})
        res.status(200).json({success: true, data})
    })
}
exports.edit = async (req, res)=>{
    const img = {image: `/uploads/shops/${req.file.filename}`}
    await Shop.findOne({_id: req.params.id },async (err,data)=> {
        if (err) return res.status(200).json({success: false, err});
        fs.unlink(
            path.join(path.dirname(__dirname) + `/public${data.image}`),
            (err) => {
                if (err) return res.status(400).json({success: false, err});
            }
        )
    })
    await Shop.updateOne({_id: req.params.id},{$set: {...req.body, ...img}}, (err, data)=>{
        if(err){
            return res.status(400).json({success: false, data: 'Not Found'})
        }
        res.status(200).json({success: true, data})
    })
}
exports.delete = async (req,res)=>{
    await Shop.findOne({_id:req.params.id},async (err,data)=>{
        if(err || !data) {return res.status(404).json({success:false, message: "Not Found this Id"});}

        deleteFile(`/public${data.fileContract}`)
        deleteFile(`/public${data.fileCertificate}`)
        deleteFile(`/public${data.image}`)
        await Shop.findByIdAndDelete({_id: data._id})
        res.status(200).json({
            success: true,
            data: []
        })
    })
}
