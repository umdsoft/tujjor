const router = require('express').Router();
const multer = require('multer');
const md5 = require('md5');
const path = require('path');
// const NewsController = require('../controllers/NewsController')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(file);
        if (file.mimetype.startsWith('video')) {
            cb(null, './public/uploads/news/videos');
            
        } else if (file.mimetype.startsWith('image')) {
            cb(null, './public/uploads/news/images');
        }
    },
    filename: function (req,file,cb) {
        cb(null, `${md5(Date.now())}${path.extname(file.originalname)}`);
    }
});
const upload = multer({storage: storage});

router.post('/create', upload.single('file'), (req, res) => {
    return res.status(200).json({ success: true, data: req.file});
});
// router.get('/all', NewsController.getAll);
// router.get('/:id', NewsController.getOne);
// router.put('/:id', NewsController.edit);
// router.delete('/:id', NewsController.delete);

module.exports = router;