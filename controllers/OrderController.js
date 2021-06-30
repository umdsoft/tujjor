const jwt = require("jsonwebtoken");
const Order = require("../models/order");
const Shop = require("../models/shop");

exports.create = async (req, res) => {
    // const token = req.headers.authorization;
    // const user = jwt.decode(token.slice(7));

    const count = Order.countDocuments() + 1;
    const product = [];
    req.body.product &&
        req.body.product.forEach(async (element) => {
            await Shop.findById({ _id: element.shop }).then((shop) => {
                product.push({
                    ...element,
                    account: shop.shopId,
                });
            });
        });
    const order = new Order({
        user: req.body.user,
        amount: req.body.amount,
        orderId: count,
        address: {
            region: req.body.region,
            district: req.body.district,
            address: req.body.address,
        },
        product,
    });
    await order
        .save()
        .then(() => {
            res.status(201).json({ success: true, data: order });
        })
        .catch((err) => {
            res.status(400).json({ success: false, err });
        });
};

exports.getAll = async (req, res) => {
    const order = await Order.find();

    res.status(200).json({
        success: true,
        data: order,
    });
};
