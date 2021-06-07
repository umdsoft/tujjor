const Joi = require('joi');
const mongoose = require('mongoose');
const BannerSchema = new mongoose.Schema({
    image: {type: String, required: true},
    position: {type: Number, required: true, enum: [1, 2, 3, 4, 5]}
})
exports.Banner = mongoose.model('banner', BannerSchema);

exports.validate = (banner)=>{
    const schema = Joi.object({
        position: Joi.number().required().valid(1, 2, 3, 4, 5)
    });

    return schema.validate(banner);
}