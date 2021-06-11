const JWT = require('jsonwebtoken');
const User = require('../models/user');
exports.protectUser = async (req , res , next) => {
    let token;
    if (req.headers.token &&
        req.headers.token.startsWith('Bearer')) {
        token = req.headers.token.split(' ')[1];
    }
    if (!token) {
        return res.status(401).json({success: false , data: "No authorize to access this route"})
    }
    try {
        //  verify token
        const decoded = JWT.verify( token, process.env.JWT_SECRET);
     //   console.log(decoded);
        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        return res.status(401).json({success: false , data: "No authorize to access this route"})
    }
}
exports.protectAdmin = async (req , res , next) => {
    let token;
    if (req.headers.token &&
        req.headers.token.startsWith('Bearer')) {
        token = req.headers.token.split(' ')[1];
    }
    if (!token) {
        return res.status(401).json({success: false , data: "No authorize to access this route"})
    }
    try {
        //  verify token
        const decoded = JWT.verify( token, process.env.JWT_SECRET);
        let user = await User.findById(decoded.id)
        console.log("user", user);
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({success: false , data: "No authorize to access this route"})
    }
}
exports.protectSeller = async (req , res , next) => {
    let token;
    if (req.headers.token &&
        req.headers.token.startsWith('Bearer')) {
        token = req.headers.token.split(' ')[1];
    }
    if (!token) {
        return res.status(401).json({success: false , data: "No authorize to access this route"})
    }
    try {
        //  verify token
        const decoded = JWT.verify( token, process.env.JWT_SECRET);
        let user = await User.findById(decoded.id)
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({success: false , data: "No authorize to access this route"})
    }
}