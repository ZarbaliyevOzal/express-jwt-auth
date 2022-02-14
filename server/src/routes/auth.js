const router = require('express').Router()
const AuthController = require('../controllers/AuthController')

const authController = new AuthController()

router.post('/login', authController.login)

router.post('/signup', authController.signup)

router.post('/token', authController.token)

router.post('/logout', authController.logout)

module.exports = router