const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
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

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.pre('remove', async function(next) {
    await this.model('Like').deleteMany({user: this._id});
    await this.model('Order').deleteMany({user: this._id});
    next();
});
// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id}, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRE
    });
};

module.exports = mongoose.model('user',UserSchema)