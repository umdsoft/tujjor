const {Slider} = require('../models/slider');
const fs = require("fs");
const path = require("path");

exports.create = (req, res) => {
    const slider = new Slider({
        image: `/uploads/sliders/${req.file.filename}`
    });
    slider.save()
    .then(data => {
        res.status(200).json({success: true, data});
    }).catch(err => {
        res.status(500).json({
            message: err.message || "Something wrong while creating the slider."
        });
    });
};

exports.getAll = (req, res) => {
    Slider.find()
    .then(data => {
        res.status(200).json({success: true, data});
    }).catch(err => {
        res.status(500).json({
            message: err.message || "Something wrong while retrieving slider."
        });
    });
};

exports.edit = async (req, res) => {
    const img = { image: `/uploads/sliders/${req.file.filename}` }
    await Slider.findById({_id: req.params.id },async (err,data)=> {
        if (err) return res.status(200).json({success: false, err});
        fs.unlink(
            path.join(path.dirname(__dirname) + `/public${data.image}`),
            (err) => {
                if (err) return res.status(400).json({success: false, err});
            }
        )
    })
    await Slider.findByIdAndUpdate({_id: req.params.id},{$set: {...req.body, ...img}})
    .then(data => {
        if(!data) {
            return res.status(404).json({
                message: "Slider not found with id " + req.params.id
            });
        }
        res.status(200).json({success: true});
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).json({
                message: "Slider not found with id " + req.params.id
            });                
        }
        return res.status(500).json({
            message: "Something wrong updating note with id " + req.params.id
        });
    });
};

exports.delete = (req, res) => {
    Slider.findByIdAndRemove(req.params.id)
    .then(slider => {
        if(!slider) {
            return res.status(404).json({
                success: false,
                message: "Slider not found with id " + req.params.id
            });
        }
        fs.unlink(
            path.join(path.dirname(__dirname), `/public${slider.image}`),
            (err) => {
                if (err) return res.status(400).json({success: false, err});
            }
        )
        res.json({message: "Slider deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).json({
                success: false,
                message: "Slider not found with id " + req.params.id
            });                
        }
        return res.status(500).json({
            success: false,
            message: "Could not delete slider with id " + req.params.id
        });
    });
};
