const Slider = require("../models/slider");
const sharp = require("sharp");
const path = require("path");
const { deleteFile } = require("../utils");

exports.create = async (req, res) => {
    const { filename } = req.file;
    await sharp(path.join(path.dirname(__dirname) + `/public/temp/${filename}`))
        .jpeg({
            quality: 70,
        })
        .toFile(path.join(path.dirname(__dirname) + `/public/uploads/sliders/${filename}`), (err) => {
            if (err) {
                console.log(err);
            }
            deleteFile(`/public/temp/${filename}`);
        });
    const slider = new Slider({
        image: `/uploads/sliders/${filename}`,
        url: req.body.url
    });
    slider
        .save()
        .then((data) => {
            res.status(200).json({ success: true, data });
        })
        .catch((err) => {
            res.status(500).json({
                message: err.message || "Something went wrong while creating the slider.",
            });
        });
};

exports.getAll = (req, res) => {
    Slider.find({},{__v: 0})
        .then((data) => {
            res.status(200).json({ success: true, data });
        })
        .catch((err) => {
            res.status(500).json({
                message: err.message || "Something went wrong while retrieving slider.",
            });
        });
};
exports.edit = async (req, res) => {
    await Slider.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body })
        .then((data) => {
            if (!data) {
                return res.status(404).json({
                    message: "Slider not found with id " + req.params.id,
                });
            }
            res.status(200).json({ success: true });
        })
        .catch((err) => {
            if (err.kind === "ObjectId") {
                return res.status(404).json({
                    message: "Slider not found with id " + req.params.id,
                });
            }
            return res.status(500).json({
                message: "Something went wrong updating note with id " + req.params.id,
            });
        });
};

exports.editImage = async (req, res) => {
    const img = { image: `/uploads/sliders/${req.file.filename}` };
    await Slider.findById({ _id: req.params.id }, async (err, data) => {
        if (err) return res.status(200).json({ success: false, err });
        deleteFile(`/public${data.image}`);
    });
    await Slider.findByIdAndUpdate({ _id: req.params.id }, { $set: img }).exec((err, data) => {
        if (err) return res.status(400).json({ success: false, err });
        return res.status(200).json({ success: true, data });
    });
};
exports.delete = (req, res) => {
    Slider.findByIdAndRemove(req.params.id)
        .then((slider) => {
            if (!slider) {
                return res.status(404).json({
                    success: false,
                    message: "Slider not found with id " + req.params.id,
                });
            }
            deleteFile(`/public${slider.image}`);
            res.json({ message: "Slider deleted successfully!" });
        })
        .catch((err) => {
            if (err.kind === "ObjectId" || err.name === "NotFound") {
                return res.status(404).json({
                    success: false,
                    message: "Slider not found with id " + req.params.id,
                });
            }
            return res.status(500).json({
                success: false,
                message: "Could not delete slider with id " + req.params.id,
            });
        });
};
