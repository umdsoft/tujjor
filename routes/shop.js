const router = require("express").Router();
const ShopController = require("../controllers/ShopController");
const multer = require("multer");
const md5 = require("md5");
const path = require("path");
const { protectAdmin, protectSeller, protectClient } = require("../middleware/auth");
const { validateFile } = require("../middleware/errorFileUpload");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads/shops");
    },
    filename: function (req, file, cb) {
        cb(null, `${md5(Date.now())}${path.extname(file.originalname)}`);
    },
});
const upload = multer({ storage: storage });

//admin
router.get("/all", protectAdmin, ShopController.getShops);
router.get("/contract/all", protectAdmin, ShopController.getContracts);
router.get("/one/:id", protectAdmin, ShopController.getOneAdmin);
router.put("/status/:id", protectAdmin, ShopController.editStatus);
router.delete("/:id", protectAdmin, ShopController.delete);

//seller
router.post("/image/upload", upload.single("image"), validateFile, ShopController.imageUpload )
router.put(
    "/:id",
    protectSeller,
    ShopController.edit
);
router.get("/me", protectSeller, ShopController.getOne);

//client
router.post(
    "/create",
    protectClient,
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "fileContract", maxCount: 1 },
        { name: "fileCertificate", maxCount: 1 },
    ]),
    validateFile,
    ShopController.create
);
router.get("/client/:slug", protectClient, ShopController.getOneClient);
router.get("/all/filter", protectClient, ShopController.getShopsClient);

module.exports = router;
