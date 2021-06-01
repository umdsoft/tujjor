const Joi = require("joi");
const mongoose = require("mongoose");

const InfoSchema = new mongoose.Schema({
    title: {
        uz: { type: String, required: true },
        ru: { type: String, required: true}
    },
    description:{
        uz: { type: String, required: true },
        ru: { type: String, required: true}
    },
    status: {type: Boolean, required: true, default: true},
    slug: { type: String, required: true, unique: true },
    type: { type: String, required: true, enum:['image', 'video']}
},{timestamps: true})
exports.Info = mongoose.model('info', InfoSchema);
exports.validate = (info) => {
    const schema = Joi.object({
        title: {
            uz: Joi.string().required(),
            ru: Joi.string().required()
        },
        description: {
            uz: Joi.string().required(),
            ru: Joi.string().required()
        },
        status: Joi.boolean(),
    });

    return schema.validate(info);
}