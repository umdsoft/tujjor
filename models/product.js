const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema(
    {
        name: {
            uz: { type: String, index: true, required: true, trim: true },
            ru: { type: String, index: true, required: true, trim: true },
        },
        category: {
            type: mongoose.Schema.ObjectId,
            ref: "category",
            required: true,
        },
        shop: { type: mongoose.Schema.ObjectId, ref: "shop", required: true },
        brand: { type: mongoose.Schema.ObjectId, ref: "brand", required: true },
        description: {
            uz: { type: String, index: true },
            ru: { type: String, index: true },
        },
        article: { type: String, index: true, unique: true, required: true },
        slug: { type: String, index: true, unique: true, required: true },
        tags: { type: Array, index: true },
    },
    { timestamps: true }
);
module.exports = mongoose.model("product", ProductSchema);
