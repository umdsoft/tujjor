const mongoose = require("mongoose");
const BrandSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    image: {type: String, required: true},
    category: { type: mongoose.Schema.ObjectId, ref: 'category', required: true },
    slug: {type: String, required: true, unique: true}
},{timestamps: true})
BrandSchema.pre('remove', async function (next) {
    await this.model('Product').deleteMany({brand: this._id});
    next();
});
module.exports = mongoose.model('brand', BrandSchema);