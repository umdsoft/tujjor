const router = require('express').Router();
const multer = require('multer');
const md5 = require('md5');
const path = require('path');
const NewsController = require('../controllers/NewsController');
const { validateFile } = require('../middleware/errorFileUpload');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.mimetype.startsWith('video')) {
            cb(null, './public/uploads/news/videos');
        } else {
            cb(null, './public/uploads/news/images');
        }
    },
    filename: function (req,file,cb) {
        cb(null, `${md5(Date.now())}${path.extname(file.originalname)}`);
    }
});
const upload = multer({storage: storage});

//admin
router.post('/create', upload.single('file'), validateFile, NewsController.create);
router.get('/all', NewsController.getAll);
router.get('/:slug', NewsController.getOne);
router.get('/type', NewsController.getType);
router.put('/:id', NewsController.edit);
router.put('/file/:id', upload.single('file'), validateFile, NewsController.editFile);
router.delete('/:id', NewsController.delete);

//client
router.get('/client/all', NewsController.getClientAll);
module.exports = router;