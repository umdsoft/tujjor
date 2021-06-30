const router = require("express").Router();
const LikeController = require("../controllers/LikeController");
const { protect } = require("../middleware/auth");

router.post("/create", protect, LikeController.create);
router.get("/", protect, LikeController.getAll);
router.delete("/:id", protect, LikeController.delete);
router.delete("/all", protect, LikeController.deleteAll);

module.exports = router;
