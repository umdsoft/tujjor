const router = require("express").Router();
const ShopController = require("../controllers/ShopController");
const multer = require("multer");
const md5 = require("md5");
const path = require("path");
const { protectAdmin } = require("../middleware/auth");
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
router.get("/all", ShopController.getShops);
router.get("/contract/all", ShopController.getContracts);
router.get("/one/:id", ShopController.getOneAdmin);
router.put("/status/:id", ShopController.editStatus);
router.put("/:id", upload.single("image"), validateFile, ShopController.edit);
router.delete("/:id", ShopController.delete);

//client
router.post(
    "/create",
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "fileContract", maxCount: 1 },
        { name: "fileCertificate", maxCount: 1 },
    ]),
    validateFile,
    ShopController.create
);
router.get("/:user", ShopController.getOne);
router.get("/client/all", ShopController.getShopsClient);

module.exports = router;
