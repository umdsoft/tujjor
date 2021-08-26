const router = require("express").Router();
const Statistic = require("../controllers/Statistic");

router.post("/shops", Statistic.statShop);
router.post("/brands", Statistic.statBrand);
router.post("/users", Statistic.statUser);
router.post("/category", Statistic.statCategory);
router.get("/dashboard", Statistic.dashboardAdmin);

module.exports = router;
