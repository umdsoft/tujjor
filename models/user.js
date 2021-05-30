const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
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


// Match user entered password to hashed password in database
UserSchema.pre('remove', async function(next) {
    await this.model('Like').deleteMany({user: this._id});
    await this.model('Order').deleteMany({user: this._id});
    next();
});
// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

module.exports = mongoose.model('user',UserSchema)
