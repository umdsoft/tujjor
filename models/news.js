const mongoose = require("mongoose");
const NewsSchema = new mongoose.Schema({
    title: {
        uz: { type: String, required: true},
        ru: { type: String, required: true}
    },
    description:{
        uz: { type: String, required: true },
        ru: { type: String, required: true}
    },
    hashtag: { type: String },
    startTime: {type: String, required: true},
    file: {type: String, required: true},
    status: {type: Boolean, required: true, default: true},
    slug: { type: String, required: true, unique: true },
    type: { type: String, required: true, enum:['image', 'video']}
}, { timestamps: true })

module.exports = mongoose.model('news', NewsSchema);