const router = require('express').Router()
const AuthController = require('../controllers/AuthController')
const { auth } = require('../middlewares')

const authController = new AuthController()

router.post('/login', authController.login)

router.post('/signup', authController.signup)

router.post('/token', authController.token)

router.post('/logout', authController.logout)

router.get('/verify-email/:id/:token', authController.verifyEmail)

router.post('/resend-verification-link', auth, authController.resendVerificationLink)

module.exports = router