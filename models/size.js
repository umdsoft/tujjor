
const Joi = require('joi');
const mongoose = require('mongoose');
const SizeSchema = new mongoose.Schema({
    productId: {type: mongoose.Schema.ObjectId, ref: 'product', required: true},
    paramId: {type: mongoose.Schema.ObjectId, ref: 'param', required: true},
    size: {type: String, required: true},
    price: {type: Number, required: true},
    count: {type: Number, required: true}
})
exports.Size = mongoose.model('size', SizeSchema);

exports.validateSize = (size) => {
    const schema = Joi.object({
        productId: Joi.string().required(),
        paramId: Joi.string().required(),
        size: Joi.string().required(),
        price: Joi.number().required(),
        count: Joi.number().required()
    });

    return schema.validate(size);
}