
const Joi = require('joi');
const mongoose = require('mongoose');
const ParamSchema = new mongoose.Schema({
    color: {type: String, required: true},
    productId: {type: mongoose.Schema.ObjectId, ref: 'product', required: true}
})
exports.Param = mongoose.model('param', ParamSchema);
exports.validateParam = (param) => {
    const schema = Joi.object({
        color: Joi.string().required(),
        productId: Joi.string().required(),
    });

    return schema.validate(param);
}