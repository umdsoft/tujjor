const router = require("express").Router();
const PaymentController = require("../controllers/PaymentController");

router.post("/payme", PaymentController.payme);
router.post("/payme/url", PaymentController.paymeUrl);

module.exports = router;
