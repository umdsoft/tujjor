const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
    image: {type: String, required: true}
}, { timestamps: true })

module.exports = mongoose.model('image', ImageSchema);
