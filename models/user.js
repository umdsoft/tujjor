const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const UserSchema = new mongoose.Schema({
    phone: {type: String, unique: true, required: true, trim: true},
    password: {type: String, required: true},
    name: {type: String, required: true, trim: true},
    email: {type: String, unique: true, required: true}
},{timestamps: true})

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

module.exports = mongoose.model('user',UserSchema)