
const mongoose = require('mongoose');
const ProductImageSchema = new mongoose.Schema({
    paramId: {type: mongoose.Schema.ObjectId, ref: 'param', required: true},
    image: {type: String, required: true}
})
module.exports = mongoose.model('productImage', ProductImageSchema);