const router = require("express").Router();
const CategoryController = require("../controllers/CategoryController");

router.post("/create", CategoryController.create);
router.get("/all", CategoryController.getAll);
router.get("/:slug", CategoryController.getOne);
router.delete("/:id", CategoryController.delete);
router.put("/:id", CategoryController.edit);

module.exports = router;
