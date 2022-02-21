const router = require('express').Router()
const AuthController = require('../controllers/AuthController')
const PasswordResetLinkController = require('../app/controllers/auth/PasswordResetLinkController')
const { auth } = require('../middlewares')
const NewPasswordController = require('../app/controllers/auth/NewPasswordController')

const authController = new AuthController()

router.post('/login', authController.login)

router.post('/signup', authController.signup)

router.post('/token', authController.token)

router.post('/logout', authController.logout)

router.get('/verify-email/:id/:token', authController.verifyEmail)

router.post('/resend-verification-link', auth, authController.resendVerificationLink)

router.post('/password-reset', PasswordResetLinkController.store)

router.post('/password-reset/:token', NewPasswordController.store)

module.exports = router