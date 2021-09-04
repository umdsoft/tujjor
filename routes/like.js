const router = require("express").Router();
const LikeController = require("../controllers/LikeController");
const { protectUser } = require("../middleware/auth");

router.post("/create", protectUser, LikeController.create);
router.get("/all", protectUser, LikeController.getAll);
router.get("/count", protectUser, LikeController.getCount);
router.delete("/:id", protectUser, LikeController.delete);
router.delete("/rm/all", protectUser, LikeController.deleteAll);

module.exports = router;
