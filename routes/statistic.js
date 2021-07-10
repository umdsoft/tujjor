const router = require("express").Router();
const Statistic = require("../controllers/Statistic");

router.post("/shops", Statistic.statShop);

module.exports = router;
