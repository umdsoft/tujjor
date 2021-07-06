const Order = require("../models/order");
const Shop = require("../models/shop");

exports.create = (req, res) => {
    Order.countDocuments({}, async (err, count) => {
        let order = {
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
                ? req.body.products.map(async (element) => {
                      let shop = await Shop.findById({ _id: element.shop });
                      console.log(shop.shopId, element.name);
                      return { ...element, account: shop.shopId };
                  })
                : [],
        };

        console.log(order);

        await new Order(order)
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
