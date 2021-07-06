const Order = require("../models/order");
const Shop = require("../models/shop");

exports.create = (req, res) => {
    Order.countDocuments({}, async (err, count) => {
        const product = [];

        const order = new Order({
            user: req.user,
            amount: req.body.amount,
            orderId: count,
            address: {
                region: req.body.address ? req.body.address.region : "",
                district: req.body.address ? req.body.address.district : "",
                address: req.body.address ? req.body.address.address : "",
                address: req.body.address ? req.body.address.phone : "",
            },
            products: req.body.product
                ? req.body.product.forEach(async (element) => {
                      await Shop.findById({ _id: element.shop }).then(
                          (shop) => {
                              product.push({
                                  ...element,
                                  account: shop.shopId,
                              });
                          }
                      );
                  })
                : [],
        });
        await order
            .save()
            .then(() => {
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
