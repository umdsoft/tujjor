const router = require("express").Router();
const ProductController = require("../controllers/ProductController");
const multer = require("multer");
const md5 = require("md5");
const path = require("path");
const { validateFile } = require("../middleware/errorFileUpload");
const { protectClient, protectSeller } = require("../middleware/auth");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
        cb(null, `${md5(Date.now())}${path.extname(file.originalname)}`);
    },
});
const upload = multer({ storage: storage });

//get all && filter
router.get("/all", protectSeller, ProductController.getAll);
router.get("/:slug", ProductController.getOneClient);
router.get("/seller/:slug", ProductController.getOneSeller);
router.post("/filter", ProductController.filter);
router.post("/count", ProductController.count);

//create
router.post("/comment/create", protectClient, ProductController.commentCreate);
router.post("/create", upload.single("image"), validateFile, ProductController.create);
router.post(
    "/param/create",
    upload.single("image"),
    validateFile,
    ProductController.createParam
);
router.post("/size/create", ProductController.createSize);
router.post(
    "/image/create",
    upload.single("image"),
    validateFile,
    ProductController.createImage
);
router.post(
    "/footerimage/create",
    upload.single("image"),
    validateFile,
    ProductController.createFooterImage
);

//discount
router.post("/discount/create", protectSeller, ProductController.createDiscount);
router.post("/discount/create/all", protectSeller, ProductController.createDiscountAll);

//update
router.put("/:id",  ProductController.edit);
router.put("/cardImage/:id", upload.single("image"), validateFile, ProductController.editCardImage);
router.put(
    "/param/:id",
    upload.single("image"),
    validateFile,
    ProductController.editParam
);
router.put("/size/:id", ProductController.editSize);

//delete
router.delete("/:id", ProductController.delete);
router.delete("/image/:id", ProductController.deleteImage);
router.delete("/footerImage/:id", ProductController.deleteFooterImage);
router.delete("/param/:id", ProductController.deleteParam);
router.delete("/size/:id", ProductController.deleteSize);

module.exports = router;
