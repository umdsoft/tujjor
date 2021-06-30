const router = require("express").Router();
const LikeController = require("../controllers/LikeController");
const { protect } = require("../middleware/auth");

// router.post("/create", protect("client"), LikeController.create);
// router.get("/", protect("client"), LikeController.getAll);
// router.delete("/:id", protect("client"), LikeController.delete);
// router.delete("/all", protect("client"), LikeController.deleteAll);

module.exports = router;
