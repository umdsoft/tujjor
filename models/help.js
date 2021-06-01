const Joi = require("joi");
const mongoose = require("mongoose");

const HelpSchema = new mongoose.Schema({
    title: {
        uz: { type: String, required: true },
        ru: { type: String, required: true}
    },
    status: {type: Boolean, required: true, default: true},
    description:{
        uz: { type: String, required: true },
        ru: { type: String, required: true}
    },
    slug: {type: String, required: true, unique: true}
},{timestamps: true})
exports.Help = mongoose.model('help', HelpSchema);
exports.validate = (help) => {
    const schema = Joi.object({
        title: {
            uz: Joi.string().required(),
            ru: Joi.string().required()
        },
        status: Joi.boolean(),
        description: {
            uz: Joi.string().required(),
            ru: Joi.string().required()
        },
    });

    return schema.validate(help);
}