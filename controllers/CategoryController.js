const {Category, validate} = require('../models/category')
const {getSlug} = require('../utils')
function createCategories (categories, parentId = null){
    const categoryList = []
    let category;
    if(parentId == null){
        category =  categories.filter(cat => cat.parentId == undefined)
    }else {
        category = categories.filter(cat => cat.parentId == parentId)
    }
    //console.log(category)
    for(let cate of category){
        categoryList.push({
            _id: cate._id,
            name: {
                uz: cate.name.uz,
                ru: cate.name.ru
            },
            parentId: cate.parentId,
            slug: cate.slug,
            children: createCategories(categories, cate._id)
        })
    }
    return categoryList
}
const deleteCategory = async (parentId) => {
    let item = await Category.find({parentId});
    if(item.length) {
        item.forEach(key=>{
            Category.findByIdAndDelete(key._id).then(()=>{
                deleteCategory(key._id);
            })
        })
    }
}
exports.create = (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).json({success: false, message: error.details[0].message});
    const category = new Category({
        name: {
            uz: req.body.name.uz,
            ru: req.body.name.ru
        },
        slug: getSlug(req.body.name.ru)
    })
    if(req.body.parentId){
        category.parentId = req.body.parentId
    }
    category.save()
        .then(()=>{
            res.status(200).json({success: true,data: category})
        })
        .catch((err)=>{
            res.status(400).json({success: false, err})
        })
}                                                                       
exports.getCategory = async (req, res, next) => {
    await Category.find()
    .exec((error, categories) => {
        if(error)  res.status(400).json({error})
        if(categories){
            const categoryList = createCategories(categories)
            res.status(200).json({success: true, data: categoryList })
        }
    })
};
exports.getById = (req, res)=>{
    Category.findOne({ slug: req.params.slug }, (err, data) => {
        if (err) {
            return res.status(400).json({success: false, err})
        }
        res.status(200).json({success: true, data})
    })
}
exports.deleteCategory = async (req,res)=>{

    await Category.findByIdAndDelete({_id: req.params.id}).then(()=>{
        deleteCategory(req.params.id);
        res.status(200).json({data: []})
    })
}
exports.editCategory = async (req,res)=>{
    await Category.updateOne({_id: req.params.id},{$set:req.body},(err,data)=>{
        if(err) return res.status(400).json({success: false})
        res.status(200).json({success: true})
    })
}