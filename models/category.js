const mongoose = require("mongoose");
const CategorySchema = new mongoose.Schema(
    {
        name: {
            uz: { type: String, index: true, required: true, trim: true },
            ru: { type: String, index: true, required: true, trim: true },
        },
        parentId: { type: String },
        slug: { type: String, index: true, required: true },
    },
    { timestamps: true }
);
CategorySchema.pre("remove", async function (next) {
    await this.model("Product").remove({ category: this._id });
    next();
});
module.exports = mongoose.model("Category", CategorySchema);
