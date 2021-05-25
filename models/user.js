const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    phone: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    name: {type: String, required: true, trim: true},
    role: {type: String, required: true, default: '0'}
},{timestamps: true})

module.exports = mongoose.model('user',UserSchema)