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
ProductImageSchema.deleteImage = (id) => {
    this.findByIdAndDelete({ productId: id }).then((image) => {
        if (image) {
            deleteFile(`/public${image.image}`);
        } else {
            this.delete(id);
        }
    });
};

module.exports = mongoose.model("ProductImage", ProductImageSchema);
