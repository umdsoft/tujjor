const JWT = require('jsonwebtoken');
const asyncHandler = require('./async');
const User = require('../models/user');
const config = require('../config/config');
exports.protect = asyncHandler( async (req , res , next) => {
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
        const decoded = JWT.verify( token, config.JWT_SECRET);
     //   console.log(decoded);
        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        return res.status(401).json({success: false , data: "No authorize to access this route"})
    }

})