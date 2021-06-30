const express = require("express");
const router = express.Router();
const Regions = require("../controllers/RegionsController");
router.post("/create", Regions.addRegion);
router.get("/all", Regions.getRegions);
router.put("/:id", Regions.editRegion);
router.delete("/:id", Regions.deleteRegion);

router.post("/district/create", Regions.addDistrict);
router.put("/district/:id", Regions.updateDistrict);
router.delete("/district/:id", Regions.deleteDistrict);

module.exports = router;
