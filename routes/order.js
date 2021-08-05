const router = require("express").Router();
const OrderController = require("../controllers/OrderController");
const { protectClient } = require("../middleware/auth");

router.post("/create", protectClient, OrderController.create);
router.get("/all", OrderController.getAll);
router.get("/me", protectClient, OrderController.getMeOrder);
router.put("/:id", OrderController.update);
router.get("/one/:id", OrderController.getById);

module.exports = router;
