const router = require('express').Router();
const ApplicationShopController = require('../controllers/ApplicationShopController')
const { protectUser, protectSeller } = require("../middleware/auth");

router.post('/create', protectUser, ApplicationShopController.create);
router.get('/all', ApplicationShopController.getAll);
router.get('/me', protectUser, ApplicationShopController.getOne);
router.put('/status/:id', ApplicationShopController.editStatus);
router.delete('/:id', ApplicationShopController.delete);

module.exports = router;
