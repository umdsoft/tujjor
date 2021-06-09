
const router = require('express').Router();
const multer = require('multer');
const md5 = require('md5');
const path = require('path');
const SliderController = require('../controllers/SliderController');
const { validateFile } = require('../middleware/errorFileUpload');

const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null, './public/uploads/temp');
    },
    filename: function (req,file,cb) {
        cb(null, `${md5(Date.now())}${path.extname(file.originalname)}`);
    }
});
const upload = multer({storage: storage});

router.post('/create', upload.single('image'), validateFile, SliderController.create);
router.get('/all', SliderController.getAll);
router.delete('/:id',SliderController.delete);
router.put('/:id', upload.single('image'), validateFile, SliderController.edit);

module.exports = router;
