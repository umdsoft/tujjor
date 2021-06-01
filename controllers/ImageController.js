const Image = require("../models/images");
exports.create = (req, res) => {
    if (!req.file.filename) {
        return res.status(400).json({success: false, message: "Required"})
    }
    console.log(req.file.filename)
    const img = new Image({
        image: `/uploads/images/${req.file.filename}`
    })
    img.save().then(() => {
        return res.status(200).json({success: true, data: img})
    }).catch(err => {
        return res.status(400).json({success: false, err})
    })
}
