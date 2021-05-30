/** @format */

const express = require("express")
const router = express.Router()
const Category = require("../controllers/CategoryController")

router.post("/create", Category.create)
router.get("/all", Category.getCategory)
router.delete("/:id", Category.deleteCategory)
router.put("/:id", Category.editCategory)

module.exports = router
