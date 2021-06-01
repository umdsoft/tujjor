const Joi = require('joi');
const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({
    name: {type: String, unique: true, required: true, trim: true},
    user: {type: mongoose.Schema.ObjectId, ref: 'user', required: true},
    image: {type: String, required: true},
    description: {type: String},
    info:{
        email: {type: String, required: true},
        phone: {type: String, required: true},
        address: {type: String, required: true}
    },
    category: {type: mongoose.Schema.ObjectId, ref: 'category', required: true},
    status: { type: Number, enum: [0, 1], default: 0 },
    slug: {type: String, unique: true, required: true}
},{timestamps: true})
exports.Shop = mongoose.model('shop', ShopSchema);

exports.validate = (shop) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        user: Joi.string().required(),
        category: Joi.string().required(),
        description: Joi.string().required(),
        email: Joi.string().required(),
        phone: Joi.string().required(),
        address: Joi.string().required(),
        status: Joi.number().required().valid(0, 1),
    });

    return schema.validate(schema);
}