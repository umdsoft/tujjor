const router = require('express').Router();
const ShopController = require('../controllers/ShopController');
const multer = require('multer');
const md5 = require('md5');
const path = require('path');
const { protectAdmin } = require('../middleware/auth');
const { validateFile } = require('../middleware/errorFileUpload');

const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null, './public/uploads/shops');
    },
    filename: function (req,file,cb) {
        cb(null, `${md5(Date.now())}${path.extname(file.originalname)}`);
    }
});
const upload = multer({storage: storage});

router.post('/create', upload.single('image'), validateFile, ShopController.create);
router.get('/all', ShopController.getShop);
router.get('/:id', ShopController.getOne);
router.put('/status/:id', ShopController.editStatus);
router.put('/:id', upload.single('image'), validateFile, ShopController.edit);
router.delete('/:id', ShopController.delete);

module.exports = router;