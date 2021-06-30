const router = require("express").Router();
const UserController = require("../controllers/UserController");
const { protect } = require("../middleware/auth");

router.post("/create", UserController.register);
router.post("/login", UserController.loginClient);
router.post("/admin/login", UserController.loginAdmin);
router.post("/seller/login", UserController.loginSeller);
router.get("/all", UserController.getUsers);
router.get("/me", protect, UserController.me);
router.delete("/:id", UserController.delete);
module.exports = router;
