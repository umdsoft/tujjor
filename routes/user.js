const express = require('express')
const router = express.Router()
const User = require('../controllers/UserController')
const { protect } = require('../middleware/auth')

router.post('/create', User.register)
router.post('/login', User.login)
router.get('/all', User.getUsers)
router.get('/me', protect, User.me)

module.exports = router;