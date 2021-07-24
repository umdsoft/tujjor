const router = require("express").Router();
const TagController = require("../controllers/TagController");

router.post("/create", TagController.create);
router.get("/all", TagController.getAll);
router.delete("/:id", TagController.delete);

module.exports = router;
