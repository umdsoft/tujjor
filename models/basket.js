const mongoose = require("mongoose");
const BasketSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    param: { type: mongoose.Schema.ObjectId, ref: "Param", required: true },
    size: { type: mongoose.Schema.ObjectId, ref: "Size", required: true },
    product: { type: mongoose.Schema.ObjectId, ref: "Product", required: true },
    count: { type: Number, required: true },
});
module.exports = mongoose.model("Basket", BasketSchema);
