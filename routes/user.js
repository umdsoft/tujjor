const router = require("express").Router();
const UserController = require("../controllers/UserController");
const multer = require("multer");
const md5 = require("md5");
const path = require("path");
const { protectClient, protectAdmin } = require("../middleware/auth");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
        cb(null, `${md5(Date.now())}${path.extname(file.originalname)}`);
    },
});
const upload = multer({ storage: storage });
router.post("/checkCode", UserController.checkCode);
router.post("/getCode", UserController.sendCode);

// router.post("/create", UserController.register);
router.post("/admin/login", UserController.loginAdmin);
router.post("/seller/login", UserController.loginSeller);
router.get("/all", protectAdmin, UserController.getUsers);
router.get("/me", protectClient, UserController.clientMe);
router.get("/userMe", UserController.me);
router.delete("/:id", protectAdmin, UserController.delete);
router.put("/update", protectClient, upload.single("image"), UserController.edit);
router.post("/reset", UserController.resetPassword)
router.post("/reset/checkCode", UserController.checkCodeResetPassword)
module.exports = router;
