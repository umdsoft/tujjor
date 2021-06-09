const mongoose = require('mongoose');
const SliderSchema = new mongoose.Schema({
    image: {type: String, required: true},
})
module.exports = mongoose.model('slider', SliderSchema);