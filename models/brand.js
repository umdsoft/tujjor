const Joi = require("joi");
const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    image: {type: String, required: true},
    category: { type: mongoose.Schema.ObjectId, ref: 'category', required: true },
    slug: {type: String, required: true, unique: true}
})
exports.Brand = mongoose.model('brand', BrandSchema);
exports.validate = (brand) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        category: Joi.string().required()
    });

    return schema.validate(brand);
}