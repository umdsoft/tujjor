const router = require('express').Router();
const multer = require('multer');
const md5 = require('md5');
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null, './public/uploads/images');
    },
    filename: function (req,file,cb) {
        cb(null, `${md5(Date.now())}${path.extname(file.originalname)}`);
    }
});
const upload = multer({storage: storage});

router.post('/create', upload.single('image'), (req, res) => {
    res.status(200).json({success: true, url: `/uploads/images/${req.file.filename}`})
})

module.exports = router;