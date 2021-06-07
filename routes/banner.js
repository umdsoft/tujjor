
const router = require('express').Router();
const multer = require('multer');
const md5 = require('md5');
const path = require('path');
const BannerController = require('../controllers/BannerController');

const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null, './public/uploads/banners');
    },
    filename: function (req,file,cb) {
        cb(null, `${md5(Date.now())}${path.extname(file.originalname)}`);
    }
});
const upload = multer({storage: storage});

router.post('/create', upload.single('image'), BannerController.create);
router.get('/all', BannerController.getAll);
router.delete('/:id',BannerController.delete);
router.put('/:id', upload.single('image'), BannerController.edit);

module.exports = router;
