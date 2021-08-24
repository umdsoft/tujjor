const mongoose = require("mongoose");
const OrderProductsSchema = new mongoose.Schema(
    {
        status: {
            type: Number,
            enum: [0, 1, 2, 3, 4, 5],
            default: 0,
        },
        orderId: {
            type: Number,
            required: true, 
            index: true
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        product: {
            type: mongoose.Schema.ObjectId,
            ref: "Product",
            required: true,
            index: true,
        },
        param: {
            type: mongoose.Schema.ObjectId,
            ref: "Param",
            required: true,
            index: true,
        },
        size: {
            type: mongoose.Schema.ObjectId,
            ref: "Size",
            required: true,
            index: true,
        },
        shop: {
            type: mongoose.Schema.ObjectId,
            ref: "Shop",
            required: true,
            index: true,
        },
        category: {
            type: mongoose.Schema.ObjectId,
            ref: "Brand",
            required: true,
            index: true,
        },
        brand: {
            type: mongoose.Schema.ObjectId,
            ref: "Brand",
            required: true,
            index: true,
        },
        name: {
            uz: { type: String, required: true },
            ru: { type: String, required: true },
        },
        image: { type: String, required: true },
        color: { type: String, required: true },
        size: { type: String, required: true },
        count: { type: Number, required: true },
        amount: { type: Number, required: true },
        description: {
            uz: { type: String},
            ru: { type: String},
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("OrderProducts", OrderProductsSchema);
