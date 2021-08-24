const mongoose = require("mongoose");
const SliderSchema = new mongoose.Schema({
    image: { type: String, required: true },
    url: {type: String, required: true},
});
module.exports = mongoose.model("Slider", SliderSchema);
