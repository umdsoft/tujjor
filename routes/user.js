const express = require('express')
const router = express.Router()
const User = require('../controllers/UserController')

router.post('/create', User.register)
router.post('/login', User.login)
router.get('/all', User.getUsers)

module.exports = router;