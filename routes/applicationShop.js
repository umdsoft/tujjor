const router = require('express').Router();
const ApplicationShopController = require('../controllers/ApplicationShopController')

router.post('/create', ApplicationShopController.create);
router.get('/all', ApplicationShopController.getAll);
router.get('/:user', ApplicationShopController.getOne);
router.put('/:id', ApplicationShopController.edit);
router.delete('/:id', ApplicationShopController.delete);

module.exports = router;