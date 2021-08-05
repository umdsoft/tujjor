const Product = require("../models/product");
const Param = require("../models/param");
const Size = require("../models/size");
const ProductImage = require("../models/productImage");
const FooterImage = require("../models/footerImage");
const {deleteFile} = require("../utils");
exports.deleteProduct = (id, model) => {
    const obj = {};
    obj[`${model}`] = id;
    Product.findOneAndDelete(obj).exec((err, product) => {
        if (err) {
            console.log(err);
            return;
        }
        if (product) {
            exports.deleteParam(product._id);
            exports.deleteImage(product._id);
            exports.deleteFooterImage(product._id);
            exports.deleteProduct(id, model);
        }
    });
};
exports.deleteParam = (id) => {
    Param.findOneAndDelete({ productId: id }).exec((err, param) => {
        if (err) {
            console.log(err);
            return;
        }
        if (param) {
            exports.deleteParam(id);
            exports.deleteSizeByParam(param._id);
        }
    });
};
exports.deleteSizeByProduct = (id) => {
    Size.deleteMany({ productId: id }, (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
    });
};
exports.deleteSizeByParam = (id) => {
    Size.deleteMany({ paramId: id }, (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
    });
};
exports.deleteImage = (id) => {
    ProductImage.findOneAndDelete({ productId: id }).exec((err, image) => {
        if (err) {
            console.log(err);
            return;
        }
        if (image) {
            deleteFile(`/public${image?.image}`);
            deleteFile(`/public${image?.smallImage}`);
            exports.deleteImage(id);
        }
    });
};
exports.deleteFooterImage = (id) => {
    FooterImage.findOneAndDelete({ productId: id }).exec((err, image) => {
        if (err) {
            console.log(err);
            return;
        }
        if (image) {
            deleteFile(`/public${image?.image}`);
            exports.deleteFooterImage(id);
        }
    });
};
