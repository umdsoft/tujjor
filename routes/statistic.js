const router = require("express").Router();
const Statistic = require("../controllers/Statistic");

router.post("/create", Statistic.create);
router.get("/:user", Statistic.getAll);
router.delete("/:id", Statistic.delete);

module.exports = router;
