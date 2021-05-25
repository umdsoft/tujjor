const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({
    name: {type: String, unique: true, required: true, trim: true},
    adminId: {type: String, required: true}
    // adminId: {type:mongoose.Schema.ObjectId,ref:'User', required: true}
})
module.exports = mongoose.model('shop', ShopSchema);