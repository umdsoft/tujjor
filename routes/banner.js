const router = require("express").Router();
const multer = require("multer");
const md5 = require("md5");
const path = require("path");
const BannerController = require("../controllers/BannerController");
const { validateFile } = require("../middleware/errorFileUpload");
const { protectAdmin } = require("../middleware/auth");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads/banners");
    },
    filename: function (req, file, cb) {
        cb(null, `${md5(Date.now())}${path.extname(file.originalname)}`);
    },
});
const upload = multer({ storage: storage });
//admin
router.post(
    "/create",
    protectAdmin,
    upload.single("image"),
    validateFile,
    BannerController.create
);
router.get("/admin/all", protectAdmin, BannerController.getAllForAdmin);
router.delete("/:id", protectAdmin,  BannerController.delete);
router.put("/:id", protectAdmin, BannerController.edit);
router.put(
    "/image/:id",
    protectAdmin,
    upload.single("image"),
    validateFile,
    BannerController.editImage
    );
    
    //client
router.get("/all", BannerController.getAll);
module.exports = router;
