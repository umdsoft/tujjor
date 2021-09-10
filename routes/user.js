const router = require("express").Router();
const UserController = require("../controllers/UserController");
const multer = require("multer");
const md5 = require("md5");
const path = require("path");
const { protectUser, protectAdmin } = require("../middleware/auth");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
        cb(null, `${md5(Date.now())}${path.extname(file.originalname)}`);
    },
});
const upload = multer({ storage: storage });

router.post("/create", UserController.register);
router.post("/checkCode", UserController.checkCode);
router.post("/getCode", UserController.phoneVerification);
router.post("/login", UserController.loginClient);
router.post("/admin/login", UserController.loginAdmin);
router.post("/seller/login", UserController.loginSeller);
router.get("/all", protectAdmin, UserController.getUsers);
router.get("/me", protectUser, UserController.me);
router.delete("/:id", protectAdmin, UserController.delete);
router.put("/update", protectUser, upload.single("image"), UserController.edit);
router.post("/reset", protectUser, UserController.resetPassword)
module.exports = router;
