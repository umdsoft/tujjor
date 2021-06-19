const mongoose = require("mongoose");
const NewsSchema = new mongoose.Schema(
    {
        title: {
            uz: { type: String, required: true },
            ru: { type: String, required: true },
        },
        description: {
            uz: { type: String, required: true },
            ru: { type: String, required: true },
        },
<<<<<<< HEAD
        hashtag: { type: String },
=======
        hashtag: { type: String, index: true },
>>>>>>> 1129fda557ba52590f2b27ca698b6c3d0cd2f34f
        startTime: { type: String, required: true },
        file: { type: String, required: true },
        status: { type: Boolean, required: true, default: true },
        slug: { type: String, required: true, unique: true },
        type: { type: String, required: true, enum: ["image", "video"] },
    },
    { timestamps: true }
);

module.exports = mongoose.model("news", NewsSchema);
