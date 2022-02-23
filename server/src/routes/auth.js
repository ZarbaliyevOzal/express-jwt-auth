const router = require('express').Router()
const PasswordResetLinkController = require('../app/controllers/auth/PasswordResetLinkController')
const { auth } = require('../middlewares')
const NewPasswordController = require('../app/controllers/auth/NewPasswordController')
const RegisterController = require('../app/controllers/auth/RegisterController')
const LoginController = require('../app/controllers/auth/LoginController')
const TokenController = require('../app/controllers/auth/TokenController')
const VerifyEmailController = require('../app/controllers/auth/VerifyEmailController')
const VerificationLinkController = require('../app/controllers/auth/VerificationLinkController')

router.post('/api/v1/login', LoginController.store)

router.post('/api/v1/signup', RegisterController.store)

router.post('/api/v1/token', TokenController.store)

router.get('/api/v1/verify-email/:id/:token', VerifyEmailController.store)

router.post('/api/v1/resend-verification-link', auth, VerificationLinkController.store)

router.post('/api/v1/password-reset', PasswordResetLinkController.store)

router.post('/api/v1/password-reset/:token', NewPasswordController.store)

module.exports = router