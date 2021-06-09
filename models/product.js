const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    name: {
        "uz": {type: String, required: true, trim: true},
        "ru": {type: String, required: true, trim: true},
    },
    category: {type: mongoose.Schema.ObjectId, ref: 'category', required: true},
    shop:  {type: mongoose.Schema.ObjectId, ref: 'shop', required: true},
    brand:  {type: mongoose.Schema.ObjectId, ref: 'brand', required: true},
    description: {
        "uz": String,
        "ru": String,
    },
    article: {type: String, unique: true, required: true},
    slug: {type: String, unique: true, required: true},
    tags: {type: Array}
},{timestamps: true})

module.exports = mongoose.model('product', ProductSchema);