const {Product, validate} = require('../models/product');

exports.create = (req, res) => {
    const {error} = validate(req.body);
    if(error) {
        res.status(400).json({message: error.details[0].message})
    }
    const product = new Product({
        name: {
            uz: req.body.name.uz,
            ru: req.body.name.ru
        },
        shop: req.body.shop,
        category: req.body.category,
        brand: req.body.brand,
        description: {
            uz: req.body.description?.uz || "",
            ru: req.body.description?.ru || ""
        },
        hashtag: req.body.hashtag || ""
    });
    product.save()
    .then(data => {
        res.status(200).json({success: true, data});
    }).catch(err => {
        res.status(500).json({
            message: err.message || "Something wrong while creating the product."
        });
    });
};

exports.getAll = (req, res) => {
    Product.find()
    .then(data => {
        res.status(200).json({success: true, data});
    }).catch(err => {
        res.status(500).json({
            message: err.message || "Something wrong while retrieving products."
        });
    });
};

exports.getOne = (req, res) => {
    Product.findOne({slug: req.params.slug})
    .then(product => {
        if(!product) {
            return res.status(404).json({
                message: "Product not found"
            });            
        }
        res.send(product);
    }).catch(err => {
        return res.status(404).json({
            message: "Product not found"
        });
    });
};

exports.edit = (req, res) => {
    const {error} = validate(req.body);
    if(error) {
        res.status(400).json({message: error.details[0].message})
    }

    Product.findByIdAndUpdate(req.params.id, {$set: req.body})
    .then(data => {
        if(!data) {
            return res.status(404).json({
                message: "Product not found with id " + req.params.id
            });
        }
        res.status(200).json({success: true, data});
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).json({
                message: "Product not found with id " + req.params.id
            });                
        }
        return res.status(500).json({
            message: "Something wrong updating note with id " + req.params.id
        });
    });
};

exports.delete = (req, res) => {
    Product.findByIdAndRemove(req.params.id)
    .then(product => {
        if(!product) {
            return res.status(404).send({
                message: "Product not found with id " + req.params.id
            });
        }
        res.send({message: "Product deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Product not found with id " + req.params.productId
            });                
        }
        return res.status(500).send({
            message: "Could not delete product with id " + req.params.productId
        });
    });
};