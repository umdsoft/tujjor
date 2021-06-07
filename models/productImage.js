
const Joi = require('joi');
const mongoose = require('mongoose');
const ProductImageSchema = new mongoose.Schema({
    paramId: {type: mongoose.Schema.ObjectId, ref: 'param', required: true},
    image: {type: String, required: true}
})
exports.ProductImage = mongoose.model('productImage', ProductImageSchema);
exports.validateProductImage = (productImage) => {
    const schema = Joi.object({
        paramId: Joi.string().required()
    });

    return schema.validate(productImage);
}