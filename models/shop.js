const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({
    name: { type: String, required: true},
    user: {type: mongoose.Schema.ObjectId, ref: 'user', required: true},
    image: {type: String, required: true},
    description: {
        uz: { type: String},
        ru: { type: String}
    },
    info:{
        email: {type: String, required: true},
        phone: {type: String, required: true},
        address: {type: String, required: true}
    },
    category: {type: mongoose.Schema.ObjectId, ref: 'category', required: true},
    status: { type: Number, enum: [0, 1], default: 0},
    slug: {type: String, unique: true, required: true}
},{timestamps: true})
module.exports = mongoose.model('shop', ShopSchema);
