const User = require("../models/user");

exports.register = async (req, res) => {
    console.log("req", req.body);
    if (!req.body) {
        return res.status(400).json({
            success: false,
            data: "required",
        });
    }
    const user = new User({
        name: req.body.name,
        password: req.body.password,
        phone: req.body.phone,
    });

    await user
        .save()
        .then(() => {
            res.status(201).json({
                success: true,
            });
        })
        .catch((err) => {
            res.status(400).json({
                success: false,
                err,
            });
        });
};
exports.login = async (req, res) => {
    console.log("req", req.body);
    if (!req.body) {
        return res.status(400).json({
            success: false,
            data: "required",
        });
    }
    await User.findOne(
        { phone: req.body.phone, password: req.body.password },
        (err, user) => {
            if (err) return res.send(err);
            if (!user) {
                return res.json({
                    success: false,
                    data: "phone or password wrong",
                });
            }
            res.status(200).json({ success: true });
        }
    );
};
exports.getUsers = async (req, res) => {
    User.find({}, { name: 1, phone: 1, _id: 0 }, function (err, data) {
        res.status(200).json({ success: true, data });
    });
};
