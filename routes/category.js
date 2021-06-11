const router = require("express").Router();
const CategoryController = require("../controllers/CategoryController");

<<<<<<< HEAD
router.post("/create", CategoryController.create);
router.get("/all", CategoryController.getCategory);
router.get("/:slug", CategoryController.getById);
router.delete("/:id", CategoryController.deleteCategory);
router.put("/:id", CategoryController.editCategory);
=======
router.post('/create', CategoryController.create)
router.get('/all', CategoryController.getAll)
router.get('/:slug', CategoryController.getOne)
router.delete('/:id',CategoryController.delete)
router.put('/:id',CategoryController.edit)
>>>>>>> 6dc414ae5c78cb4f16842c8d2ac00ad6d33716a1

module.exports = router;
