const Product = require("../models/product");
const Param = require("../models/param");
const Size = require("../models/size");
const ProductImage = require("../models/productImage");
const FooterImage = require("../models/footerImage");

exports.deleteProduct = (id, model) => {
    const obj = {};
    obj[`${model}`] = id;
    Product.findOneAndDelete(obj).exec((err, product) => {
        if (err) {
            console.log(err);
            return;
        }
        if (product) {
            this.deleteParam(product._id);
            this.deleteImage(product._id);
            this.deleteFooterImage(product._id);
            this.deleteProduct(id, model);
        }
    });
};
exports.deleteParam = (id) => {
    Param.findOneAndDelete({ productId: id }).exec((err, param) => {
        console.log("DELETE PARAM", param);
        if (err) {
            console.log(err);
            return;
        }
        if (param) {
            deleteFile(`/public${param.image}`);
            this.deleteParam(id);
            this.deleteSizeByParam(param._id);
        }
    });
};
exports.deleteSizeByProduct = (id) => {
    Size.deleteMany({ productId: id }, (err, data) => {
        console.log("DELETE Size", data);
        if (err) {
            console.log(err);
            return;
        }
    });
};
exports.deleteSizeByParam = (id) => {
    Size.deleteMany({ paramId: id }, (err, data) => {
        console.log("DELETE Size", data);
        if (err) {
            console.log(err);
            return;
        }
    });
};
exports.deleteImage = (id) => {
    ProductImage.findOneAndDelete({ productId: id }).exec((err, image) => {
        console.log("DELETE Image", image);
        if (err) {
            console.log(err);
            return;
        }
        if (image) {
            deleteFile(`/public${image?.image}`);
            this.deleteImage(id);
        }
    });
};
exports.deleteFooterImage = (id) => {
    FooterImage.findOneAndDelete({ productId: id }).exec((err, image) => {
        console.log("DELETE footerImage", image);
        if (err) {
            console.log(err);
            return;
        }
        if (image) {
            deleteFile(`/public${image?.image}`);
            this.deleteFooterImage(id);
        }
    });
};
