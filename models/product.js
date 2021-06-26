const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema(
    {
        name: {
            uz: { type: String, index: true, required: true, trim: true },
            ru: { type: String, index: true, required: true, trim: true },
        },
        category: {
            type: mongoose.Schema.ObjectId,
            ref: "Category",
            required: true,
        },
        shop: { type: mongoose.Schema.ObjectId, ref: "Shop", required: true },
        brand: { type: mongoose.Schema.ObjectId, ref: "Brand", required: true },
        description: {
            uz: { type: String, index: true },
            ru: { type: String, index: true },
        },
        image: { type: String, required: true },
        article: { type: String, index: true, unique: true, required: true },
        slug: { type: String, index: true, unique: true, required: true },
        tags: [{ type: mongoose.Schema.ObjectId, ref: "Tag" }],
    },
    { timestamps: true }
);
ProductSchema.post("findByIdAndRemove", async function (next) {
    console.log("Working findByIdAndRemove");
    await this.model("Param").remove({ productId: this._id });
    await this.model("Size").remove({ productId: this._id });
    await this.model("productImages").remove({ productId: this._id });
    next();
});
ProductSchema.post("remove", async function (next) {
    console.log("Working remove");
    await this.model("Param").remove({ productId: this._id });
    await this.model("Size").remove({ productId: this._id });
    await this.model("productImages").remove({ productId: this._id });
    next();
});
ProductSchema.post("deleteOne", async function (next) {
    console.log("Working deleteOne");
    await this.model("Param").remove({ productId: this._id });
    await this.model("Size").remove({ productId: this._id });
    await this.model("productImages").remove({ productId: this._id });
    next();
});
module.exports = mongoose.model("Product", ProductSchema);
