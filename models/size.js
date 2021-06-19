const mongoose = require("mongoose");
const SizeSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: "product",
        required: true,
    },
    paramId: { type: mongoose.Schema.ObjectId, ref: "param", required: true },
    size: { type: String, index: true, required: true },
    price: { type: Number, index: true, required: true },
    count: { type: Number, index: true, required: true },
});
module.exports = mongoose.model("size", SizeSchema);
