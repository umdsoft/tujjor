const {Banner, validate} = require('../models/banner');
const fs = require("fs");
const path = require("path");

exports.create = (req, res) => {
    const {error} = validate(req.body);
    if(error) {
        res.status(400).json({message: error.details[0].message})
    }
    if (!req.file) {
        return res.status(400).json({success: false, message: "File don't upload"})
    }
    const banner = new Banner({
        
        image: `/uploads/banners/${req.file.filename}`,
        position: req.body.position
    });
    banner.save()
    .then(data => {
        res.status(200).json({success: true, data});
    }).catch(err => {
        res.status(500).json({
            message: err.message || "Something wrong while creating the banner."
        });
    });
};

exports.getAll = (req, res) => {
    Banner.find()
    .then(data => {
        res.status(200).json({success: true, data});
    }).catch(err => {
        res.status(500).json({
            message: err.message || "Something wrong while retrieving banner."
        });
    });
};

exports.edit = async (req, res) => {
    const {error} = validate(req.body);
    if(error) {
        res.status(400).json({message: error.details[0].message})
    }
    if (!req.file) {
        return res.status(400).json({success: false, message: "File don't upload"})
    }
    const img = { image: `/uploads/banners/${req.file.filename}` }

    await Banner.findById({_id: req.params.id },async (err,data)=> {
        if (err) return res.status(200).json({success: false, err});
        fs.unlink(
            path.join(path.dirname(__dirname) + `/public${data.image}`),
            (err) => {
                if (err) return res.status(400).json({success: false, err});
            }
        )
    })
    await Banner.findByIdAndUpdate({_id: req.params.id},{$set: {...req.body, ...img}})
    .then(data => {
        if(!data) {
            return res.status(404).json({
                message: "Banner not found with id " + req.params.id
            });
        }
        res.status(200).json({success: true});
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).json({
                message: "Banner not found with id " + req.params.id
            });                
        }
        return res.status(500).json({
            message: "Something wrong updating note with id " + req.params.id
        });
    });
};

exports.delete = (req, res) => {
    Banner.findByIdAndRemove(req.params.id)
    .then(banner => {
        if(!banner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found with id " + req.params.id
            });
        }
        fs.unlink(
            path.join(path.dirname(__dirname), `/public${banner.image}`),
            (err) => {
                if (err) return res.status(400).json({success: false, err});
            }
        )
        res.json({message: "Banner deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).json({
                success: false,
                message: "Banner not found with id " + req.params.id
            });                
        }
        return res.status(500).json({
            success: false,
            message: "Could not delete banner with id " + req.params.id
        });
    });
};
