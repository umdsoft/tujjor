const mongoose = require("mongoose");
const SizeSchema = new mongoose.Schema({
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
    size: { type: String, index: true, required: true, index: true },
    price: { type: Number, index: true, required: true, index: true },
    count: { type: Number, index: true, required: true, index: true },
});
module.exports = mongoose.model("Size", SizeSchema);
