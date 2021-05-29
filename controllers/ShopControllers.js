const Shop = require('../models/shop');
const fs = require('fs');
const path = require('path')

exports.create = async (req, res) =>{
    const shop = new Shop({
        name: req.body.name,
        user: req.body.user,
        category: req.body.category,
        description: req.body.description,
        info: {
            phone: req.body.phone,
            email: req.body.email,
            address: req.body.address
        },
        image: `/uploads/shops/${req.file.filename}`
    })
    shop.save()
    .then(()=>{
        res.status(200).json({success:true, data: shop})
    })
    .catch(err=>{
        res.status(400).json({success:false, err})
    })
}
exports.getShop = async (req, res) => {
    res.status(200).json({success: true, data: await Shop.find({})
    // .populate({path: 'category', select:['name', '_id', 'parentId']})
})
}
exports.getOne = async (req, res) => {
    if(!req.params.id){
        return res.status(400).json({success: false, data: 'id is required'})
    }
    await Shop.findById({_id: req.params.id}, { __v: 0 }, (err, data)=>{
        if(err){
            return res.status(400).json({success: false, data:'Not Found'})
        }
        if(!data){
            return res.status(400).json({success:false, data: 'Not Found'})
        }
        res.status(200).json({success:true, data})
    }).populate('category user')
}
exports.editStatus = async (req, res)=>{
    if(!req.body.status){
        return res.status(400).json({success: false, data: 'Something is wrong'})
    }
    await Shop.updateOne({_id: req.params.id},{$set: {status: req.body.status}}, (err, data)=>{
        if(err){
            return res.status(400).json({success: false, data: 'Not Found'})
        }
        res.status(200).json({success: true, data})
    })
}
exports.edit = async (req, res)=>{
    if(!req.body || req.body.status){
        return res.status(400).json({success: false, data: 'Something is wrong'})
    }
    await Shop.updateOne({_id: req.params.id},{$set: req.body}, (err, data)=>{
        if(err){
            return res.status(400).json({success: false, data: 'Not Found'})
        }
        res.status(200).json({success: true, data})
    })
}
exports.editImage = async (req,res)=>{
    const img = {image: `uploads/shops/${req.file.filename}`}
    await Shop.findOne({_id: req.params.id },async (err,data)=> {
        if (err) return res.status(200).json({success: false, err});
        fs.unlink(
            path.join(path.dirname(__dirname) + `/public/${data.image}`),
            (err) => {
                if (err) return res.status(400).json({success: false, err});
            }
        )
    })
    await Shop.updateOne({_id: req.params.id},{$set: img})
        .exec((err,data)=>{
            if(err) return res.status(400).json({success: false,err})

            res.status(200).json({success: true, data})
        })
}
exports.delete = async (req,res)=>{
    await Shop.findOne({_id:req.params.id},async (err,data)=>{
        if(err) throw res.status(400).json({success:false, data:err});
        fs.unlink(
            path.join(path.dirname(__dirname)+`/public/${data.image}`),
            (err)=>{
                if(err) throw console.log(err);
                console.log('success')
        }
        )
        await Shop.findByIdAndDelete(data._id)
        res.status(200).json({
            success: true,
            data: []
        })
    })
}
