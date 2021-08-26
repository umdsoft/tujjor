const router = require("express").Router();
const OrderController = require("../controllers/OrderController");
const { protectClient, protectSeller } = require("../middleware/auth");

router.post("/create", protectClient, OrderController.create);
router.get("/all",protectSeller, OrderController.getAll);
router.get("/me", protectClient, OrderController.getMeOrder);
router.put("/:id", OrderController.update);
router.get("/one/:id",protectSeller, OrderController.getById);

module.exports = router;
