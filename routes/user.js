const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController')
const { protectAdmin } = require('../middleware/auth')

router.post('/create', UserController.register)
router.post('/login', UserController.login)
router.get('/all', UserController.getUsers)
router.get('/me', UserController.me)
router.delete('/:id', UserController.delete)
module.exports = router;