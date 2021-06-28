const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
        },
        product: [],
        amount: {
            type: Number,
            index: true,
            required: true,
        },
        orderId: {
            type: Number,
            required: true,
        },
        address: {
            region: {
                type: mongoose.Schema.ObjectId,
                ref: "City",
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
            required: true,
        },
        status: {
            type: Number,
            enum: [0, 1, 2, 3, 4, 5],
            // 0 - Yangi , 1 - Jo`natishga tayyor , 2 - Toshkentga jo`natildi , 3 - Toshkentga keldi
            // 4 - Yetkazildi , 5 - Bekor qilindi
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Order", OrderSchema);
