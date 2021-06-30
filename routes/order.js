const router = require("express").Router();
const OrderController = require("../controllers/OrderController");

router.post("/create", OrderController.create);
router.get("/all", OrderController.getAll);
// router.put("/:id", OrderController.edit);

module.exports = router;
