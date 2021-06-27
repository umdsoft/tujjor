const mongoose = require("mongoose");
const ProductImageSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
    },
    image: { type: String, required: true },
    smallImage: { type: String, required: true },
});
module.exports = mongoose.model("ProductImage", ProductImageSchema);
