const mongoose = require("mongoose");
const SizeSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
    },
    paramId: { type: mongoose.Schema.ObjectId, ref: "Param", required: true },
    size: { type: String, index: true, required: true },
    price: { type: Number, index: true, required: true },
    count: { type: Number, index: true, required: true },
});
module.exports = mongoose.model("Size", SizeSchema);
