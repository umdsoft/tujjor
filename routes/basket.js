const router = require("express").Router();
const BasketController = require("../controllers/BasketController");

router.post("/create", BasketController.create);
router.get("/:user", BasketController.getAll);
router.put("/:id", BasketController.edit);
router.delete("/:id", BasketController.delete);

module.exports = router;
