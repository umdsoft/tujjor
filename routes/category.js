const router = require('express').Router();
const CategoryController = require('../controllers/CategoryController')

router.post('/create', CategoryController.create)
router.get('/all', CategoryController.getCategory)
router.get('/:slug', CategoryController.getById)
router.delete('/:id',CategoryController.deleteCategory)
router.put('/:id',CategoryController.editCategory)

module.exports = router;
