const router = require("express").Router();
const ProductController = require("../controllers/ProductController");
const multer = require("multer");
const md5 = require("md5");
const path = require("path");
const { validateFile } = require("../middleware/errorFileUpload");

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
router.get("/all", ProductController.getAll);
router.get("/:slug", ProductController.getOne);
router.post("/filter", ProductController.filter);

//create
router.post(
    "/create",
    // upload.single("image"),
    // validateFile,
    ProductController.create
);
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

//update
router.put("/:id", ProductController.edit);
router.put("/param/:id", ProductController.editParam);
router.put("/size/:id", ProductController.editSize);

//delete
router.delete("/:id", ProductController.delete);
router.delete("/image/:id", ProductController.deleteImage);
router.delete("/param/:id", ProductController.deleteParam);
router.delete("/size/:id", ProductController.deleteSize);

module.exports = router;
