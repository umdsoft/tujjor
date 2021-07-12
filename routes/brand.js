const router = require("express").Router();
const multer = require("multer");
const md5 = require("md5");
const path = require("path");
const BrandController = require("../controllers/BrandController");
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

router.post("/create", upload.single("image"), validateFile, BrandController.create);
router.get("/all", BrandController.getAll);
router.get("/client/all", BrandController.getAllClient);
router.get("/:slug", BrandController.getOne);
router.put("/:id", BrandController.edit);
router.put("/image/:id", upload.single("image"), validateFile, BrandController.editImage);
router.delete("/:id", BrandController.delete);

module.exports = router;
