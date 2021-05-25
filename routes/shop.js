const express = require('express');
const router = express.Router();
const Shop = require('../controllers/ShopControllers');

router.post('/create', Shop.create);


module.exports = router;