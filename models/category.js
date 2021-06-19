const mongoose = require('mongoose')
const CategorySchema = new mongoose.Schema({
    name: {
        uz: {type: String, required: true, trim: true},
        ru: {type: String, required: true, trim: true}
    },
    parentId: { type: String},
    slug: {type: String, required: true}
}, {timestamps: true})
CategorySchema.pre('remove', async function (next) {
    await this.model('Product').deleteMany({category: this._id});
    next();
});
module.exports = mongoose.model('category',CategorySchema)