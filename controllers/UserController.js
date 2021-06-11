const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendTokenResponse = (user, statusCode, res) => {
    // Create token

    const token = user.getSignedJwtToken();
    console.log("Working...........");
    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === "production") {
        options.secure = true;
    }
    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        token,
    });
};
exports.register = async (req,res)=>{
    if(!Object.keys(req.body).length){
        return res.status(400).json({success: false, message: 'Required !'})
    }
    const salt = await bcrypt.genSalt(12);
    const pass = await bcrypt.hash(req.body.password, salt);
    const user = new User({
        name: req.body.name,
        password: pass,
        phone: req.body.phone,
        email: req.body.email,
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
    console.log("body-->", req.body);

    if (!req.body.phone || !req.body.password) {
        return res.status(400).json({
            success: false,
            data: "required",
        });
    }
    await User.findOne({ phone: req.body.phone }, (err, user) => {
        if (err) return res.send(err);
        if (!user) {
            return res.json({
                success: false,
                data: "phone or password wrong1",
            });
        }
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.json({
                success: false,
                data: "phone or password wrong2",
            });
        }
        sendTokenResponse(user, 200, res);
    });
};
exports.getUsers = async (req, res) => {
    User.find({}, function (err, data) {
        res.status(200).json({ success: true, data });
    });
};
exports.me = async (req, res) => {
    const token = req.headers.token;
    const user = jwt.decode(token.slice(7));
    await User.findOne({ _id: user.id })
        .select({ password: 0, code: 0, hash: 0 })
        .exec((err, data) => {
            if (err) return res.status(400).json({ success: false, err });
            res.status(200).json({
                success: true,
                data,
            });
        });
};
exports.delete = async (req, res) => {
    if (!req.params.id) {
        return res
            .status(400)
            .json({ success: false, data: "Somting is wrong" });
    }
    let result = await User.findByIdAndDelete({ _id: req.params.id });
    if (!result) {
        return res
            .status(400)
            .json({ success: false, data: "This id not found" });
    }
    return res.status(200).json({success: true, data:[]})
}
