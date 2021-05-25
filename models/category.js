const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
    name: {
        uz: {type: String, required: true, trim: true},
        ru: {type: String, required: true, trim: true}
    },
    parentId: {type: String}
}, {timestamps: true})

module.exports = mongoose.model('category',CategorySchema)
