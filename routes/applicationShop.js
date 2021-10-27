const router = require('express').Router();
const ApplicationShopController = require('../controllers/ApplicationShopController')
const { protectUser, protectAdmin } = require("../middleware/auth");

router.get('/all', protectAdmin, ApplicationShopController.getAll);
router.put('/status/:id', protectAdmin, ApplicationShopController.editStatus);

//client
router.delete('/:id', ApplicationShopController.delete);
router.post('/create', protectUser, ApplicationShopController.create);
router.get('/me', protectUser, ApplicationShopController.getOne);
module.exports = router;
