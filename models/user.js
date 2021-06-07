const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const UserSchema = new mongoose.Schema({
    phone: {type: String, unique: true, required: true, trim: true},
    password: {type: String, required: true},
    name: {type: String, required: true, trim: true},
    email: {type: String, unique: true, required: true},
    role: {
        type: String, 
        required: true, 
        enum:[
            'admin',
            'seller',
            'client'
        ],
        default: 'client'}
},{timestamps: true})



// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

exports.User = mongoose.model('user',UserSchema)
exports.validate = (user)=>{
    const schema = Joi.object({
        phone: Joi.string().min(12).max(13).required(),
        password: Joi.string().required(),
        name: Joi.string().required(),
        email: Joi.string().required(),
        role: Joi.string().valid('admin','seller','client').required()
    });

    return schema.validate(user);
}
