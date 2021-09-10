const User = require("../models/user");
const jwt = require("jsonwebtoken");
const sharp = require("sharp");
const path = require("path");
const bcrypt = require("bcrypt");
const { deleteFile } = require("../utils");
const SMS = require("../utils/sms");

const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();
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
exports.register = async (req, res) => {
    const user = await User.findOne({phone: req.body.phone});
    if(user){
        if(user.isPhoneVerification){
            res.status(400).json({ success: false, message: "This user already registered" })   
        } else {
            User.findOneAndDelete({phone: req.body.phone}).then( async()=>{
                const salt = await bcrypt.genSalt(12);
                const pass = await bcrypt.hash(req.body.password, salt);
                const user = new User({
                    name: req.body.name,
                    password: pass,
                    phone: req.body.phone,
                    email: req.body.email,
                });
                await user.save()
                    .then(() => {
                        res.status(201).json({ success: true, phone: user.phone})
                    })
                    .catch((err) => {
                        res.status(400).json({
                            success: false,
                            err,
                        });
                    });
            })
        }
    } else {
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
                res.status(201).json({ success: true, phone: user.phone})
            })
            .catch((err) => {
                res.status(400).json({
                    success: false,
                    err,
                });
            });
    }
};
exports.phoneVerification = async (req, res) => {
    const phone = req.body.phone;
    let code = 0;
    for (let i = 0; code.toString().length !== 5; i++) {
        code = code*10 + Math.floor(Math.random()*10)
    }
    let user = await User.findOne({phone: req.body.phone})
    if(!user) return res.status(400).json({ success: false, message: "User not found!"})
    user.updateOne({ _id: user._id}, {$set: {code: code.toString}})
    SMS(phone, code.toString());
    res.status(200).json({ success: true, message: "confirmation code sent!"})
}
exports.checkCode = async (req, res) => {
    const phone = req.body.phone;
    const code = req.body.code;
    const user = await User.findOne({phone});
    if(!user){
        return res.status(400).json({ success: false, message: "User not found!"})
    }
    if(code === user.code){
        user.isPhoneVerification = true;
        user.save();
        sendTokenResponse(user, 200, res);
    }
}

exports.loginAdmin = async (req, res) => {
    if (!req.body.phone || !req.body.password) {
        return res.status(400).json({
            success: false,
            data: "required",
        });
    }
    await User.findOne({ phone: req.body.phone }, (err, user) => {
        if (err) return res.send(err);
        if (!user || user.role != "admin") {
            return res.status(401).json({
                success: false,
                data: "phone or password wrong",
            });
        }
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(401).json({
                success: false,
                data: "phone or password wrong",
            });
        }
        sendTokenResponse(user, 200, res);
    });
};
exports.loginSeller = async (req, res) => {
    if (!req.body.phone || !req.body.password) {
        return res.status(400).json({
            success: false,
            data: "required",
        });
    }
    await User.findOne({ phone: req.body.phone }, (err, user) => {
        if (err) return res.send(err);
        if (!user || user.role != "seller") {
            return res.status(401).json({
                success: false,
                data: "phone or password wrong",
            });
        }
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(401).json({
                success: false,
                data: "phone or password wrong",
            });
        }
        sendTokenResponse(user, 200, res);
    });
};
exports.loginClient = async (req, res) => {
    if (!req.body.phone || !req.body.password) {
        return res.status(400).json({
            success: false,
            data: "required",
        });
    }
    await User.findOne({ phone: req.body.phone }, (err, user) => {
        if (err) return res.send(err);
        if (!user) {
            return res.status(401).json({
                success: false,
                data: "phone or password wrong",
            });
        }
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(401).json({
                success: false,
                data: "phone or password wrong",
            });
        }
        if(user.isPhoneVerification){
            sendTokenResponse(user, 200, res);
        } else {
            res.status(403).json({success: false, message: "Not activated!"})
        }
    });
};
exports.getUsers = async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const count = await User.countDocuments({});
    User.aggregate([
        {$project:{
            password: 0, 
            __v: 0
        }},
        {$sort: {createdAt: -1 }},
        {$skip: (page - 1) * limit},
        {$limit: limit},
    ]).exec((err, data)=>{
        if(err) return res.status(400).json({ success: false, err })
        return res.status(200).json({success: true, data, count})
    })

};
exports.me = async (req, res) => {
    await User.findOne({ _id: req.user })
        .select({ password: 0, __v: 0, role: 0, createdAt: 0, updatedAt: 0 })
        .exec(async (err, data) => {
            if (err) return res.status(400).json({ success: false, err });
            res.status(200).json({ success: true, data });
        });
};
exports.delete = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ success: false, data: "Somting is wrong" });
    }
    let result = await User.findByIdAndDelete({ _id: req.params.id });
    if (!result) {
        return res.status(400).json({ success: false, data: "This id not found" });
    }
    deleteFile(`/public${result.image}`);
    return res.status(200).json({ success: true, data: [] });
};
exports.edit = async (req, res) => {
    let filename, obj;

    if(req.file){
        filename = req.file.filename
        sharp(path.join(path.dirname(__dirname) + `/public/temp/${filename}`))
        .resize(100, 100)
        .toFile(
            path.join(path.dirname(__dirname) + `/public/uploads/users/${filename}`),
            (err) => {
                if (err) {
                    console.log(err);
                }
                deleteFile(`/public/temp/${filename}`);
            }
        );
        obj = {
            ...req.body,
            image: `/uploads/users/${filename}`,
        };
    } else {
        obj = req.body
    }
    if(obj.password || obj.role || obj.phone || obj.email){
        return res.status(400).json({ success: false, message: "Something went wrong"})
    }
    User.findByIdAndUpdate({ _id: req.user }, { $set: obj }, { new: true , fields: { __v: 0, password:0, role: 0, createdAt: 0, updatedAt: 0},}).exec((err, data) => {
        if (err) {
            return res.status(400).json({ success: false, err });
        }
        res.status(201).json({ success: true, data: data });
    });
};
exports.resetPassword = async (req, res) => {

};