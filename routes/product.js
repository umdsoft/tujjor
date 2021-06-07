const router = require('express').Router();
const ProductController = require('../controllers/ProductController')
const multer = require('multer');
const md5 = require('md5');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null, './public/uploads/productImages');
    },
    filename: function (req,file,cb) {
        cb(null, `${md5(Date.now())}${path.extname(file.originalname)}`);
    }
});
const upload = multer({storage: storage});

router.post('/create', ProductController.create)

//color routes
router.post('/param/create', ProductController.createParam)

//size routes
router.post('/size/create', ProductController.createSize)

//images routes
router.post('/image/create', upload.single('image'), ProductController.createImage)
router.get('/all', ProductController.getAll)
router.get('/:slug', ProductController.getOne)
router.delete('/:id',ProductController.delete)
router.put('/:id',ProductController.edit)

module.exports = router;
