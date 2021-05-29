const express = require('express');
const router = express.Router();
const ShopController = require('../controllers/ShopControllers');
const multer = require('multer');
const md5 = require('md5');
const path = require('path');
const { protectAdmin } = require('../middleware/auth');

const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null, './public/uploads/shops');
    },
    filename: function (req,file,cb) {
        cb(null, `${md5(Date.now())}${path.extname(file.originalname)}`);
    }
});
const upload = multer({storage: storage});

router.post('/create', upload.single('image'), ShopController.create);
router.get('/all', ShopController.getShop);
router.get('/:id', ShopController.getOne);
router.put('/status/:id', ShopController.editStatus);
router.put('/:id', ShopController.edit);
router.put('/image/:id',upload.single('image'), ShopController.editImage);
router.delete('/:id', ShopController.delete);

module.exports = router;