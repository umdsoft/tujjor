const express = require('express');
const router = express.Router();
const Shop = require('../controllers/ShopControllers');
const multer = require('multer');
const md5 = require('md5');
const path = require('path');
const { protect } = require('../middleware/auth');
const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null, './public/uploads/shops');
    },
    filename: function (req,file,cb) {
        cb(null, `${md5(Date.now())}${path.extname(file.originalname)}`);
    }
});
const upload = multer({storage: storage});

router.post('/create', protect, upload.single('image'), Shop.create);
router.get('/all', protect,Shop.getShop);
router.get('/:id', protect,Shop.getOne);
router.put('/status/:id',protect, Shop.editStatus);
router.put('/:id',protect, Shop.edit);
router.put('/image/:id',protect, upload.single('image'), Shop.editImage);
router.delete('/:id', protect, Shop.delete);

module.exports = router;