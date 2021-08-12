const Category = require("../models/category");
const { getSlug } = require("../utils");
const { updateStatusByCategory } = require("../utils/preModel");
function createCategories(categories, parentId = null) {
    const categoryList = [];
    let category;
    if (parentId == null) {
        category = categories.filter((cat) => cat.parentId == undefined);
    } else {
        category = categories.filter((cat) => cat.parentId == parentId);
    }
    for (let cate of category) {
        categoryList.push({
            _id: cate._id,
            name: {
                uz: cate.name.uz,
                ru: cate.name.ru,
            },
            parentId: cate.parentId,
            slug: cate.slug,
            children: createCategories(categories, cate._id),
        });
    }
    return categoryList;
}
function getCategoriesCreate(categories, parentId) {
    const categoryList = [];
    let category;
    category = categories.filter((cat) => cat.parentId == parentId);
    for (let cate of category) {
        categoryList.push({
            _id: cate._id,
            name: {
                uz: cate.name.uz,
                ru: cate.name.ru,
            },
            parentId: cate.parentId,
            slug: cate.slug,
            children: createCategories(categories, cate._id),
        });
    }
    return categoryList;
}
const deleteCategory = async (parentId) => {
    let item = await Category.find({ parentId });
    console.log(item.length)
    if (item.length) {
        item.forEach((key) => {
            Category.findByIdAndDelete({ _id: key._id }).then((data) => {
                console.log("deleteCategory", key.name.uz)
                updateStatusByCategory(data._id);
                deleteCategory(key._id);
            });
        });
    }
};
exports.create = (req, res) => {
    const category = new Category({
        name: {
            uz: req.body.name.uz,
            ru: req.body.name.ru,
        },
        slug: getSlug(req.body.name.ru),
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
exports.getAll = async (req, res, next) => {
    await Category.find().exec((err, categories) => {
        if (err) {return res.status(400).json({ success: false, err })}
        if (categories) {
            const categoryList = createCategories(categories);
            res.status(200).json({ success: true, data: categoryList });
        }
    });
};
exports.getOne = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ success: false, message: "Required" });
    }
    await Category.find().exec((err, categories) => {
        if (err) {return res.status(400).json({ err });}
        if (categories) {
            let category = {...categories.filter(key=>{key._id.toString() === req.params.id.toString()})[0]}
            console.log(category)
            category['children'] = getCategoriesCreate(categories, req.params.id);
            res.status(200).json({ success: true, data: category });
        }
    });
};
exports.delete = async (req, res) => {
    await Category.findByIdAndDelete({ _id: req.params.id }, (err, data) => {
        deleteCategory(req.params.id);
        updateStatusByCategory(data._id);
        res.status(200).json({ data: [] });
    });
};
exports.edit = async (req, res) => {
    await Category.updateOne({ _id: req.params.id }, { $set: req.body }, (err, data) => {
        if (err) return res.status(400).json({ success: false });
        res.status(200).json({ success: true });
    });
};
