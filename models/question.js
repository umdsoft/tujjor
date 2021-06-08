const mongoose = require("mongoose");

module.exports = mongoose.model('question', 
    new mongoose.Schema({
        name: { type: String, required: true},
        email: { type: String, required: true},
        question:{type: String, required: true}
    }, { timestamps: true })
);