
const mongoose = require('mongoose');
const ParamSchema = new mongoose.Schema({
    color: {type: String, required: true},
    productId: {type: mongoose.Schema.ObjectId, ref: 'product', required: true}
})
module.exports = mongoose.model('param', ParamSchema);
