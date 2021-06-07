const mongoose = require('mongoose');
const SliderSchema = new mongoose.Schema({
    image: {type: String, required: true},
})
exports.Slider = mongoose.model('slider', SliderSchema);