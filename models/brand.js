const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema({
    name: {type: String, unique: true, required: true},
    image: {type: String, required: true},
    category: {type: mongoose.Schema.ObjectId, ref: 'category', required: true},
})
module.exports = mongoose.model('brand', BrandSchema);