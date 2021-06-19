const mongoose = require("mongoose");
<<<<<<< HEAD
const BrandSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    image: {type: String, required: true},
    category: { type: mongoose.Schema.ObjectId, ref: 'category', required: true },
    slug: {type: String, required: true, unique: true}  
},{timestamps: true})
BrandSchema.pre('remove', async function (next) {
    await this.model('Product').deleteMany({brand: this._id});
=======
const BrandSchema = new mongoose.Schema(
    {
        name: { type: String, index: true, required: true, trim: true },
        image: { type: String, required: true },
        category: {
            type: mongoose.Schema.ObjectId,
            ref: "category",
            required: true,
        },
        slug: { type: String, index: true, required: true, unique: true },
    },
    { timestamps: true }
);
BrandSchema.pre("remove", async function (next) {
    await this.model("Product").deleteMany({ brand: this._id });
>>>>>>> 1129fda557ba52590f2b27ca698b6c3d0cd2f34f
    next();
});
module.exports = mongoose.model("brand", BrandSchema);
