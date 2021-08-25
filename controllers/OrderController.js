const Order = require("../models/order");
const OrderProducts = require("../models/orderProducts");
const Shop = require("../models/shop");
const Size = require("../models/size");
const Product = require("../models/product");
const Param = require("../models/param");
const mongoose = require("mongoose");
exports.create = (req, res) => {
    if(!(req.body.products && req.body.products.length)){
        return res
            .status(400)
            .json({ success: false, message: "Something went wrong" });
    }
    Order.countDocuments({}, async (err, count) => {
        let summ = 0;
        const order = await new Order({
            user: req.user,
            amount: req.body.amount,
            orderId: count,
            address: {
                region: req.body.address ? req.body.address.region : null,
                district: req.body.address ? req.body.address.district : null,
                address: req.body.address ? req.body.address.address : null,
                phone: req.body.address ? req.body.address.phone : null,
            },
        });
        const products = await Promise.all(
            req.body.products.map(async (element) => {
                let size = await Size.findById({_id: element.size});
                let product = await Product.findById({_id: element.product});
                let param = await Param.findById({_id: element.param});
                let shop = await Shop.findById({ _id: product.shop });
                if(size.discount && new Date(size.discount_start) <= new Date() && new Date(size.discount_end) >= new Date()){
                if (size.discount !== element.amount) {
                    return;
                } else {
                    summ += size.discount * element.count
                }               
                } else {
                    if (size.price !== element.amount) {
                        return;
                    } else {
                        summ += size.price*element.count
                    }
                };
                return {
                    status: 0,
                    orderId: count,
                    user: req.user,
                    count: element.count,
                    //product Items
                    productId: product._id,
                    name: product.name,
                    image: product.image,
                    description: product.description,
                    category: product.category,
                    brand: product.brand,
                    //param Items
                    paramId: param._id,
                    paramImage: param.image,
                    //size Items
                    sizeId: size._id,
                    size: size.size,
                    amount: element.amount,
                    //shop Items
                    shopId: shop._id,
                    account: shop.shopId,
                    percent: shop.percent
                };
            })
        )
        if (summ !== req.body.amount || !products.length) {
            return res.status(400).json({ success: false, message: "Something went wrong" });
        }
        products.forEach((element, index)=>{
            if(index === products.length-1){
                new OrderProducts(element).save().then(()=>{
                order.save().then(() => {
                        return res.status(201).json({ success: true, data: order });
                    })
                    .catch((err) => {
                       return res.status(400).json({ success: false, err });
                    });
                }).catch(err=>{
                    OrderProducts.deleteMany({orderId: order.orderId})
                    return res.status(400).json({ success: false, err });
                })
            } else {
                new OrderProducts(element).save().catch(err=>{
                    OrderProducts.deleteMany({orderId: order.orderId})
                    return res.status(400).json({ success: false, err });
                })
            }
        })
        
        
    });
};

exports.getById = async (req, res) => {
    Order.findById({_id: req.params.id}, 
        {user: 0, updatedAt: 0, createdAt: 0, __v: 0,  
            "products.productId":0,
            "products.paramId":0,
            "products.sizeId":0,
            "products.category":0,
            "products.brand":0,
            "products.shop":0,
            "products.account":0,
        }, (err, data)=>{
        if(err){
            return res.status(400).json({ success: false, err });
        } 
        res.status(200).json({ success: true , data})
    })
}
exports.getAll = async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const status = parseInt(req.query.status);
    const payed = parseInt(req.query.payed);
    const shop = await Shop.findOne({user: req.user})
     
    OrderProducts.aggregate([
        { $match: { status: status, shopId: mongoose.Types.ObjectId(shop._id), payed: payed} },
        {$sort: {createdAt: -1}},
        {$project: {
            name: 1,
            image: 1,
            paramImage: 1,
            size: 1,
            amount: 1,
            count: 1,
            description: 1,
            status: 1,
            orderId: 1
        }},
        { $skip: (page - 1) * limit }, 
        { $limit: limit },
        {$group: {
            _id: "$orderId",
            products: {$push: "$$ROOT"}
        }},
        {$lookup: {
            from: "orders",
            localField: "_id",
            foreignField: "orderId",
            as: "order"
        }},
        {$unwind: "$order"},
        {$project: {
            products:{ 
                orderId: 0
            },
            amount: "$order.amount",
            address: "$order.address",
            createdAt: "$order.createdAt",
        }},
        
    //     {$lookup:{
    //         from : "orderproducts",
    //         let: {orderId: "$orderId"},
    //         pipeline: [
    //             { $match: { $expr: { $and:[{$eq: ["$orderId", "$$orderId"]},{$eq: ["$status", status]}, {$eq: ["$shopId", mongoose.Types.ObjectId(shop._id)]}] } } },   
    //             {$project: {
    //                 name: 1,
    //                 image: 1,
    //                 paramImage: 1,
    //                 size: 1,
    //                 amount: 1,
    //                 count: 1,
    //                 description: 1,
    //                 status: 1,

    //             }}
    //         ],
    //         as: "products"
    //     }},
    //     {
    //         $facet: {
    //             count: [{ $group: { _id: null, count: { $sum: 1 } } }],
    //             data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
    //         },
    //     },
    //     {
    //         $project: {
    //             count: {
    //                 $let: {
    //                     vars: {
    //                         count: { $arrayElemAt: ["$count", 0] },
    //                     },
    //                     in: "$$count.count",
    //                 },
    //             },
    //             data: 1,
    //         },
    //     },
    ]).exec((err, data) => {
        if (err) return res.status(400).json({ success: false, err });
        res.status(200).json({
            success: true,
            data
        });
    });
};
exports.update = async (req, res) => {
    let order = await Order.findById({ _id: req.params.id});
    order.status = order.status + 1;
    order.save().then(data=>{
        res.status(200).json({success: true})
    }).catch(err=>{
        res.status(400).json({success: false})
    })
}
exports.getMeOrder = (req, res) => {
    let status = {};
    if (req.query.status === "payed") {
        status = { $match: { status: 1} };
    } else if (req.query.status === "onTheWay") {
        status = { $match: { status: {$gt: 2, $lt: 3 } } };
    } else if (req.query.status === "delivered") {
        status = { $match: { status: 4 } };
    } else if (req.query.status === "canceled") {
        status = { $match: { status: 5 } };
    }
    Order.aggregate([
        { $match: { user: mongoose.Types.ObjectId(req.user), payed: 1  } },
        status,
        {$sort: {createdAt: -1}},
    ]).exec((err, data) => {
        if (err) return res.status(400).json({ success: false, err });
        res.status(200).json({
            success: true,
            data,
        });
    });
};
