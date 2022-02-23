const router = require('express').Router()
const ProfileController = require('../app/controllers/ProfileController')
const { auth } = require('../middlewares/index')

router.get('/api/v1/me', auth, ProfileController.index)

module.exports = router

