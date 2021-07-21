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

                          if (size.price !== element.amount) {
                              return;
                          }
                          summ += size.price;
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
                .json({ success: false, message: "Amount not equal" });
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

exports.getAll = async (req, res) => {
    const order = await Order.find();

    res.status(200).json({
        success: true,
        data: order,
    });
};

exports.getMeOrder = (req, res) => {
    let status = {};
    if (req.query.status === "payed") {
        status = { $match: { status: 1 } };
    } else if (req.query.status === "onTheWay") {
        status = { $match: { status: { $and: [{ $gte: 2, $lte: 4 }] } } };
    } else if (req.query.status === "delivered") {
        status = { $match: { status: 5 } };
    }
    Order.aggregate([
        { $match: { user: mongoose.Types.ObjectId(req.user) } },
        status,
    ]).exec((err, data) => {
        if (err) return res.status(400).json({ success: false, err });
        res.status(200).json({
            success: true,
            data,
        });
    });
};
