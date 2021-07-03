const Order = require("../models/order");
const Shop = require("../models/shop");

exports.create = async (req, res) => {
    let count = 0;
    Order.count({}, (err, c) => {
        count = c + 1;
    });
    console.log(count);
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
        user: req.user,
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
