const router = require("express").Router();
const OrderController = require("../controllers/OrderController");
const { protectUser, protectSeller } = require("../middleware/auth");

router.post("/create", protectUser, OrderController.create);
router.get("/all",protectSeller, OrderController.getAll);
router.get("/me", protectUser, OrderController.getMeOrder);
router.put("/client/:id", OrderController.delivered);
router.put("/:id", protectSeller, OrderController.update);
router.get("/one/:orderId",protectSeller, OrderController.getById);

module.exports = router;
