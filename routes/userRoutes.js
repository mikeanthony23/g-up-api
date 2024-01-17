const express = require('express')

const authController = require('../controllers/authController')
const userController = require('../controllers/userController')

const router = express.Router()

router.post('/signup', authController.signup)
router.post('/login', authController.login)

// User must be authenticated after this middleware
router.use(authController.authenticated)

router.get('/', userController.getAllUser)

module.exports = router
