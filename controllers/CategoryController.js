/** @format */

const Category = require("../models/category");

function createCategories(categories, parentId = null) {
    const categoryList = [];
    let category;
    if (parentId == null) {
        category = categories.filter((cat) => cat.parentId == undefined);
    } else {
        category = categories.filter((cat) => cat.parentId == parentId);
    }
    //console.log(category)
    for (let cate of category) {
        categoryList.push({
            _id: cate._id,
            name: {
                uz: cate.name.uz,
                ru: cate.name.ru,
            },
            children: createCategories(categories, cate._id),
        });
    }
    return categoryList;
}

exports.create = (req, res) => {
    const category = new Category({
        name: {
            uz: req.body.name.uz,
            ru: req.body.name.ru,
        },
    });
    if (req.body.parentId) {
        category.parentId = req.body.parentId;
    }
    category
        .save()
        .then(() => {
            res.status(200).json({ success: true, data: category });
        })
        .catch((err) => {
            res.status(400).json({ success: false, err });
        });
};
exports.getCategory = async (req, res, next) => {
    await Category.find({})
        .sort({ num: 1 })
        .exec((error, categories) => {
            if (error) res.status(400).json({ error });
            if (categories) {
                const categoryList = createCategories(categories);
                res.status(200).json({ data: categoryList });
            }
        });
};
exports.deleteCategory = async (req, res) => {
    await Category.findByIdAndDelete(req.params.id, (err, data) => {
        if (err) throw res.status(400).json(err);
        res.status(200).json({
            success: true,
            data: [],
        });
    });
};
exports.editCategory = async (req, res) => {
    await Category.updateOne(
        { _id: req.params.id },
        { $set: req.body },
        (err, data) => {
            if (err) return res.status(400).json({ success: false });
            res.status(200).json({ success: true });
        }
    );
};
