const router = require("express").Router();
const TagController = require("../controllers/TagController");

router.post("/create", TagController.create);
router.get("/:user", TagController.getAll);
router.delete("/:id", TagController.delete);

module.exports = router;