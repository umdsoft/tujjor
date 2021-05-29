const BrandController =require('../controllers/BrandController')
const {Router} = require('express');

const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null, './public/uploads/shops');
    },
    filename: function (req,file,cb) {
        cb(null, `${md5(Date.now())}${path.extname(file.originalname)}`);
    }
});
const upload = multer({storage: storage});

Router.post('/create', BrandController.create);
Router.get('/all', BrandController.getAll);
Router.get('/:id', BrandController.getOne);
Router.put('/:id', BrandController.edit);
Router.delete('/create', BrandController.delete);