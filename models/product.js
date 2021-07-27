const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema(
    {
        name: {
            uz: { type: String, index: true, required: true, trim: true },
            ru: { type: String, index: true, required: true, trim: true },
        },
        category: {
            type: mongoose.Schema.ObjectId,
            ref: "Category",
            required: true,
            index: true
        },
        shop: { type: mongoose.Schema.ObjectId, ref: "Shop", required: true, index: true },
        brand: { type: mongoose.Schema.ObjectId, ref: "Brand", required: true, index: true },
        description: {
            uz: { type: String, index: true },
            ru: { type: String, index: true },
        },
        image: { type: String, required: true },
        article: { type: String, index: true, unique: true, required: true },
        slug: { type: String, index: true, unique: true, required: true },
        tags: [{ type: mongoose.Schema.ObjectId, ref: "Tag", index: true }],
        status: { type: Number, required: true, enum: [0, 1] },
    },
    { timestamps: true }
);
module.exports = mongoose.model("Product", ProductSchema);
