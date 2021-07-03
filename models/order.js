const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        amount: {
            type: Number,
            index: true,
            required: true,
        },
        paySystem: {
            type: String,
        },
        orderId: {
            type: Number,
            unique: true,
            required: true,
        },
        address: {
            region: {
                type: mongoose.Schema.ObjectId,
                ref: "Region",
                required: true,
            },
            district: {
                type: mongoose.Schema.ObjectId,
                ref: "District",
                required: true,
            },
            address: {
                type: String,
                required: true,
            },
        },
        payed: {
            type: Number,
            enum: [0, 1],
            default: 0,
        },
        status: {
            type: Number,
            enum: [0, 1, 2, 3, 4, 5],
            default: 0,
        },
        product: [{
                    productId: {
                        type: mongoose.Schema.ObjectId,
                        ref: "Product",
                        required: true,
                        index: true,
                    },
                    paramId: {
                        type: mongoose.Schema.ObjectId,
                        ref: "Param",
                        required: true,
                        index: true,
                    },
                    sizeId: {
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

                    account: { type: String, required: true },
                    name: { type: String, required: true },
                    image: { type: String, required: true },
                    color: { type: String, required: true },
                    size: { type: String, required: true },
                    count: { type: Number, required: true },
                    amount: { type: Number, required: true },
                },
            ]
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Order", OrderSchema);
