const router = require("express").Router();
const LikeController = require("../controllers/LikeController");
const { protectClient } = require("../middleware/auth");

router.post("/create", protectClient, LikeController.create);
router.get("/all", protectClient, LikeController.getAll);
router.get("/count", protectClient, LikeController.getAllById);
router.delete("/:id", protectClient, LikeController.delete);
router.delete("/rm/all", protectClient, LikeController.deleteAll);

module.exports = router;
