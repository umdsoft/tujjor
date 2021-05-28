const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({
    name: {type: String, unique: true, required: true, trim: true},
    user: {type: mongoose.Schema.ObjectId, ref: 'user', required: true},
    image: {type: String, required: true},
    description: {type: String},
    info:{
        email: {type: String, required: true},
        phone: {type: String, required: true},
        address: {type: String, required: true}
    },
    category: {type: mongoose.Schema.ObjectId, ref: 'category', }
})
module.exports = mongoose.model('shop', ShopSchema);