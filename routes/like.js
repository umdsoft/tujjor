const router = require("express").Router();
const LikeController = require("../controllers/LikeController");

router.post("/create", LikeController.create);
router.get("/:user", LikeController.getAll);
router.delete("/:id", LikeController.delete);

module.exports = router;
