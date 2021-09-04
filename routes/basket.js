const router = require("express").Router();
const BasketController = require("../controllers/BasketController");
const { protectUser } = require("../middleware/auth");

router.post("/create", protectUser, BasketController.create);
router.get("/all", protectUser, BasketController.getAll);
router.get("/count", protectUser, BasketController.getCount);
router.put("/:id", protectUser, BasketController.edit);
router.delete("/:id", protectUser, BasketController.delete);
router.delete("/rm/all", protectUser, BasketController.deleteAll);

module.exports = router;
