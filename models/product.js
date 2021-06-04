const mongoose = require('mongoose');
const Joi = require('joi')
const ProductSchema = new mongoose.Schema({
    name: {
        "uz": {type: String, required: true, trim: true},
        "ru": {type: String, required: true, trim: true},
    },
    category: {type: mongoose.Schema.ObjectId, ref: 'category', required: true},
    shop:  {type: mongoose.Schema.ObjectId, ref: 'shop', required: true},
    brand:  {type: mongoose.Schema.ObjectId, ref: 'brand', required: true},
    description: {
        "uz": String,
        "ru": String,
    },
    slug: {type: String, unique: true, required: true},
    hashtag: {type: String}
},{timestamps: true})

exports.Product = mongoose.model('product', ProductSchema);
exports.validate = (product) => {
    const schema = Joi.object({
        name: {
            uz: Joi.string().required(),
            ru: Joi.string().required()
        },
        shop: Joi.string().required(), 
        brand: Joi.string().required(), 
        category: Joi.string().required(),
        description: {
            uz: Joi.string(),
            ru: Joi.string()
        },
        hashtag: Joi.string()
    });

    return schema.validate(product);
}