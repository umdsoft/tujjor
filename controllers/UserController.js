const User = require('../models/user');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const config = require('../config/config')
const sendTokenResponse = (user, statusCode, res) => {
    // Create token

    const token = user.getSignedJwtToken();
    console.log("Working...........");
    const options = {
        expires: new Date(
            Date.now() + config.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };
    if (config.NODE_ENV === 'production') {options.secure = true;}
    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        });
};
exports.register = async (req,res)=>{
    if(!req.body){
        return res.status(400).json({
            success: false,
            data: 'required'
        })
    }
    const user = new User({
        name: req.body.name,
        password: req.body.password,
        phone: req.body.phone
    })

    await user.save()
        .then(()=>{
            res.status(201).json({
                success: true
            })
        })
        .catch((err)=>{
            res.status(400).json({
                success: false,
                err
            })
        })
}
exports.login = async (req,res)=>{
    if(!req.body.phone || !req.body.password){
        return res.status(400).json({
            success: false,
            data: 'required'
        })
    }
    await User.findOne({phone: req.body.phone},(err,user)=>{
        if(err) return res.send(err);
        if(!user){
            return res.json({
                success: false,
                data: 'phone or password wrong'
            })
        }
        if(!bcrypt.compareSync(req.body.password,user.password)){
            return res.json({
                success: false,
                data: 'phone or password wrong'
            })
        }
        sendTokenResponse(user,200,res)
    })
}
exports.getUsers = async (req,res)=>{
    User.find({}, function(err, data) {
        res.status(200).json({success: true, data});  
      });
}
exports.me = async (req,res)=>{
    const token = req.headers.token
    const user = jwt.decode(token.slice(7))
    await User.findOne({_id: user.id})
    .select({password: 0,code:0,hash:0})
    .exec((err,data)=>{
        if(err) return res.status(400).json({success: false,err});
        res.status(200).json({
            success: true,
            data
        })
    })
}