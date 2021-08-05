const mongoose = require("mongoose");

const ShopSchema = new mongoose.Schema(
    {
        fullNameDirector: { type: String, required: true },
        shopName: { type: String, required: true, trim: true, unique: true },
        shopId: { type: String, required: true, unique: true },
        address: { type: String, required: true },
        phone: { type: String, required: true, unique: true },
        bankName: { type: String, required: true },
        inn: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            unique: true,
            required: true,
        },
        image: { type: [String] },
        logo: { type: String },
        logotip: { type: String },
        description: {
            uz: { type: String },
            ru: { type: String },
        },
        category: {
            type: mongoose.Schema.ObjectId,
            ref: "Category",
            required: true,
        },
        status: { type: Number, enum: [0, 1, 2], default: 0 },
        slug: { type: String, unique: true, required: true },
        fileCertificate: { type: String, required: true },
        fileContract: { type: String, required: true },
    },
    { timestamps: true }
);
module.exports = mongoose.model("Shop", ShopSchema);
