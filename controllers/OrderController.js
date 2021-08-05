const Order = require("../models/order");
const Shop = require("../models/shop");
const Size = require("../models/size");
const mongoose = require("mongoose");
exports.create = (req, res) => {
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
            products: req.body.products
                ? await Promise.all(
                      req.body.products.map(async (element) => {
                          let shop = await Shop.findById({ _id: element.shop });
                          let size = await Size.findById({
                              _id: element.sizeId,
                          });
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
                          }
                          ;
                          return {
                              ...element,
                              account: "601bcec5c16ad418fad81eba",
                          };
                      })
                  )
                : [],
        });

        if (summ !== req.body.amount) {
            return res
                .status(400)
                .json({ success: false, message: "Something went wrong" });
        }
        order
            .save()
            .then((order) => {
                res.status(201).json({ success: true, data: order });
            })
            .catch((err) => {
                res.status(400).json({ success: false, err });
            });
    });
};

exports.getById = async (req, res) => {
    Order.findById({_id: req.params.id}, {user: 0, updatedAt: 0, createdAt: 0, __v: 0,  "products.productId":0}, (err, data)=>{
        if(err){
            //  {productId: 0, paramId:0, sizeId:0, shop:0,category:0, brand:0, account:0}
            return res.status(400).json({ success: false, err });
        } 
        res.status(200).json({ success: true , data})
    })
}
exports.getAll = async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const status = parseInt(req.query.status);
    Order.aggregate([
        { $match: { payed: 1, status: status } },
        {$sort: {createdAt: -1}},
        {$unwind: "$products"},
        {$group: {
            _id: "$_id",
            payed: {$first: "$payed"},
            status: {$first: "$status"},
            amount: {$first: "$amount"},
            orderId: {$first: "$orderId"},
            address: {$first: "$address"},
            count: {$sum: "$products.count"}
        }},
        {
            $facet: {
                count: [{ $group: { _id: null, count: { $sum: 1 } } }],
                data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
            },
        },
        {
            $project: {
                count: {
                    $let: {
                        vars: {
                            count: { $arrayElemAt: ["$count", 0] },
                        },
                        in: "$$count.count",
                    },
                },
                data: 1,
            },
        },
    ]).exec((err, data) => {
        if (err) return res.status(400).json({ success: false, err });
        res.status(200).json({
            success: true,
            data: data[0].data,
            count: data[0].count,
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
