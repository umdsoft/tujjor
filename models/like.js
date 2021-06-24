const mongoose = require("mongoose");
const LikeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
        unique: true,
    },
});
module.exports = mongoose.model("Like", LikeSchema);
