const router = require("express").Router();
const OrderController = require("../controllers/OrderController");
const { protectClient, protectSeller, protectAuthOrder } = require("../middleware/auth");

router.post("/create", protectAuthOrder, OrderController.create);
router.get("/all",protectSeller, OrderController.getAll);
router.get("/me", protectClient, OrderController.getMeOrder);
router.put("/client/:id", protectClient, OrderController.delivered);
router.put("/:id", protectSeller, OrderController.update);
router.get("/one/:orderId",protectSeller, OrderController.getById);
// router.get("/changeData", OrderController.changeData);

module.exports = router;
