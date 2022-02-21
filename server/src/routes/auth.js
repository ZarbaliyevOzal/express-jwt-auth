const router = require('express').Router()
const PasswordResetLinkController = require('../app/controllers/auth/PasswordResetLinkController')
const { auth } = require('../middlewares')
const NewPasswordController = require('../app/controllers/auth/NewPasswordController')
const RegisterController = require('../app/controllers/auth/RegisterController')
const LoginController = require('../app/controllers/auth/LoginController')
const TokenController = require('../app/controllers/auth/TokenController')
const VerifyEmailController = require('../app/controllers/auth/VerifyEmailController')
const VerificationLinkController = require('../app/controllers/auth/VerificationLinkController')

router.post('/login', LoginController.store)

router.post('/signup', RegisterController.store)

router.post('/token', TokenController.store)

router.get('/verify-email/:id/:token', VerifyEmailController.store)

router.post('/resend-verification-link', auth, VerificationLinkController.store)

router.post('/password-reset', PasswordResetLinkController.store)

router.post('/password-reset/:token', NewPasswordController.store)

module.exports = router