const router = require("express").Router();
const ProductController = require("../controllers/ProductController");

router.get("/discount", ProductController.getDiscounts);
router.get("/popular", ProductController.popularProducts);

module.exports = router;
