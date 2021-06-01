const Joi = require("joi");
const mongoose = require("mongoose");

const InfoSchema = new mongoose.Schema({
    title: {
        uz: { type: String, required: true },
        ru: { type: String, required: true}
    },
    status: {type: Boolean, required: true},
    description:{
        uz: { type: String, required: true },
        ru: { type: String, required: true}
    },
    slug: {type: String, required: true, unique: true}
},{timestamps: true})
exports.Info = mongoose.model('info', InfoSchema);
exports.validate = (info) => {
    const schema = Joi.object({
        title: {
            uz: Joi.string().required(),
            ru: Joi.string().required()
        },
        status: Joi.boolean().required(),
        description: {
            uz: Joi.string().required(),
            ru: Joi.string().required()
        },
    });

    return schema.validate(info);
}