const Joi = require('joi');
const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
    name: {
        uz: {type: String, required: true, trim: true},
        ru: {type: String, required: true, trim: true}
    },
    parentId: { type: String},
    slug: {type: String, required: true}
}, {timestamps: true})

exports.Category = mongoose.model('category',CategorySchema)
exports.validate = (category) => {
    const schema = Joi.object({
        name: {
            uz: Joi.string().required(),
            ru: Joi.string().required()
        },
        parentId: Joi.string()
    });
    return schema.validate(category);
};