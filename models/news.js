const Joi = require("joi");
const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema({
    title: {
        uz: { type: String, required: true },
        ru: { type: String, required: true}
    },
    description:{
        uz: { type: String, required: true },
        ru: { type: String, required: true}
    },
    hashtag: {type: String},
    file: {type: String, required: true},
    status: {type: Boolean, required: true, default: true},
    slug: { type: String, required: true, unique: true },
    type: { type: String, required: true }
}, { timestamps: true })

exports.News = mongoose.model('news', NewsSchema);
exports.validate = (news) => {
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

    return schema.validate(news);
}