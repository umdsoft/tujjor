const router = require("express").Router();
const LikeController = require("../controllers/LikeController");
const { protectClient, protectAdmin } = require("../middleware/auth");

router.post("/create", protectClient, LikeController.create);
router.get("/", protectAdmin, LikeController.getAll);
router.delete("/:id", protectClient, LikeController.delete);

module.exports = router;
