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
SizeSchema.methods.deleteByProduct = (id) => {
    console.log("DELETE Size .....");
    this.deleteMany({ productId: id });
};
SizeSchema.methods.deleteByParam = (id) => {
    console.log("DELETE Size .....");
    this.deleteMany({ paramId: id });
};
module.exports = mongoose.model("Size", SizeSchema);
