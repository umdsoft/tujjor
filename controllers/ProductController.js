const mongoose = require('mongoose');
const Product = require('../models/product');
const Param = require('../models/param');
const Size = require('../models/size');
const ProductImage = require('../models/productImage');
const {getSlug} = require('../utils')
exports.create = (req, res) => {
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
        article: req.body.article,
        tags: req.body.tags || "",
        slug: getSlug(req.body.name.ru)
    });
    product.save()
    .then(data => {
        res.status(200).json({success: true});
    }).catch(err => {
        res.status(500).json({
            message: err.message || "Something wrong while creating the product."
        });
    });
};
exports.createParam = (req, res) => {
    const param = new Param({
        color: req.body.color,
        productId: req.body.productId
    })
    param.save()
    .then(data => {
        res.status(200).json({success: true});
    }).catch(err => {
        res.status(500).json({
            message: err.message || "Something wrong while creating the param."
        });
    });
}
exports.createSize = (req, res) => {
    const size = new Size({
        productId: req.body.productId,
        paramId: req.body.paramId,
        size: req.body.size,
        price: req.body.price,
        count: req.body.count
    })
    size.save()
    .then(data => {
        res.status(200).json({success: true});
    }).catch(err => {
        res.status(500).json({
            message: err.message || "Something wrong while creating the size."
        });
    });
}
exports.createImage = (req, res) => {
    const image = new ProductImage({
        paramId: req.body.paramId,
        image: `/uploads/productImages/${req.file.filename}`
    })

    image.save()
    .then(() => {
        res.status(200).json({success: true});
    }).catch(err => {
        res.status(500).json({
            message: err.message || "Something wrong while creating the image."
        });
    });
}
exports.getAll = async (req, res) => {
    
    await Product.aggregate(
        [
            {$sort: {createdAt: -1}},
            {
                $lookup:{
                    from: "categories",
                    let: { category: "$category" },    
                    pipeline : [
                        { $match: { $expr: { $eq: [ "$_id", "$$category" ] } }, },
                        { $project : {name: 1, _id: 0} }
                    ],
                    as: "category"
                },
            },
            {$unwind: "$category"},
            {
                $lookup:{
                    from: "params",
                    let: { productId: "$_id"},
                    pipeline: [
                        { $match:
                           { $expr:
                              { 
                                  $eq: ["$productId", "$$productId"]
                              }
                           }
                        },
                        { $project : {color: 1, _id: 0} },
                        { 
                            $lookup: { 
                                from: 'productimages',
                                let: { paramId: "$_id"},
                                pipeline: [
                                    { $match:
                                        { $expr:
                                           { 
                                               $eq: ["$paramId", "$$paramId"]
                                           }
                                        }
                                     },
                                     { $project : {image: 1, _id: 0} }
                                ],
                                as: 'productImages' 
                            } 
                        },
                        { 
                            $lookup: { 
                                from: 'sizes',
                                let: { paramId: "$_id"},
                                pipeline: [
                                    { $match:
                                        { $expr:
                                           { 
                                               $eq: ["$paramId", "$$paramId"]
                                           }
                                        }
                                     },
                                     { $project : { price: 1, _id: 0, size: 1} }
                                ],
                                as: 'sizes' 
                            } 
                        }
                    ],
                    as: "params"
                }
            }
        ]
        ).exec((err,data)=>{
        if(err) return res.status(400).json({success: false , err})
        res.status(200).json({success: true, data})
    })
};

exports.getOne = async (req, res) => {
    console.log(req.params.id)
    await Product.aggregate([
        {$match: {_id: mongoose.Types.ObjectId(req.params.id)}},
        {
            $lookup:{
                from: "brands",
                let: { brand: "$brand" },    
                pipeline : [
                    { $match: { $expr: { $eq: [ "$_id", "$$brand" ] } }, },
                    { $project : { __v: 0, createdAt: 0, updatedAt: 0, slug: 0} }
                ],
                as: "brand"
            }
        },
        {$unwind: "$brand"},
        {
            $lookup:{
                from: "categories",
                let: { category: "$category" },    
                pipeline : [
                    { $match: { $expr: { $eq: [ "$_id", "$$category" ] } }, },
                    { $project : { __v: 0, createdAt: 0, updatedAt: 0, slug: 0} }
                ],
                as: "category"
            },
        },
        {$unwind: "$category"},
        {
            $lookup:{
                from: "shops",
                let: { shop: "$shop" },    
                pipeline : [
                    { $match: { $expr: { $eq: [ "$_id", "$$shop" ] } }, },
                    { $project : { __v: 0, createdAt: 0, updatedAt: 0, slug: 0} }
                ],
                as: "shop"
            },
        },
        {$unwind: "$shop"},
        {
            $lookup:{
                from: "params",
                let: { productId: "$_id"},
                pipeline: [
                    { $match:
                       { $expr:
                          { 
                              $eq: ["$productId", "$$productId"]
                          }
                       }
                    },
                    { $project : { __v: 0, createdAt: 0, updatedAt: 0, slug: 0} },
                    { 
                        $lookup: { 
                            from: 'productimages',
                            let: { paramId: "$_id"},
                            pipeline: [
                                { $match:
                                    { $expr:
                                       { 
                                           $eq: ["$paramId", "$$paramId"]
                                       }
                                    }
                                 },
                                 { $project : { __v: 0, createdAt: 0, updatedAt: 0, slug: 0} }
                            ],
                            as: 'productImages' 
                        } 
                    },
                    { 
                        $lookup: { 
                            from: 'sizes',
                            let: { paramId: "$_id"},
                            pipeline: [
                                { $match:
                                    { $expr:
                                       { 
                                           $eq: ["$paramId", "$$paramId"]
                                       }
                                    }
                                 },
                                 { $project : { __v: 0, createdAt: 0, updatedAt: 0, slug: 0} }
                            ],
                            as: 'sizes' 
                        } 
                    }
                ],
                as: "params"
            }
        }
    ]).exec((err,data)=>{
        if(err) return res.status(400).json({success: false , err})
        res.status(200).json({success: true, data: data[0]})
    })
};

exports.edit = (req, res) => {
    Product.findByIdAndUpdate({_id:req.params.id}, {$set: req.body})
    .then(data => {
        if(!data) {
            return res.status(404).json({
                message: "Product not found with id " + req.params.id
            });
        }
        res.status(200).json({success: true});
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
            return res.status(404).json({
                message: "Product not found with id " + req.params.id
            });
        }
        res.json({message: "Product deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).json({
                message: "Product not found with id " + req.params.id
            });                
        }
        return res.status(500).json({
            message: "Could not delete product with id " + req.params.id
        });
    });
};