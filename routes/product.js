const router = require('express').Router();
const ProductController = require('../controllers/ProductController')

router.post('/create', ProductController.create)
router.get('/all', ProductController.getAll)
router.get('/:slug', ProductController.getOne)
router.delete('/:id',ProductController.delete)
router.put('/:id',ProductController.edit)

module.exports = router;
