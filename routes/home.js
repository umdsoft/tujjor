const router = require("express").Router();
const Controller = require("../controllers/Controller");

router.get("/discount", Controller.getDiscounts);
router.get("/popular", Controller.popularProducts);
router.get("/all", Controller.all);

module.exports = router;
