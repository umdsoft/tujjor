const Shop = require('../models/shop');

exports.create = async (req, res) =>{
    if(!req.body){
        res.status(400).json({success: false, messsage: "required"})
    }
    const shop = new Shop({
        name: req.body.name,
        adminId: req.body.adminId
    })
    shop.save()
    .then(()=>{
        res.status(200).json({success:true, data: shop})
    })
    .catch(err=>{
        res.status(400).json({success:false, err})
    })
}