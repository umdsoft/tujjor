const Brand = require("../models/brand");

exports.create = (req, res) => {
    if (!req.body) {
        return res.status(400).json({success: false, data: 'required'})
    }
}
exports.getAll = (req, res)=>{}
exports.getOne = (req, res)=>{}
exports.edit = (req, res)=>{}
exports.delete = (req, res)=>{}