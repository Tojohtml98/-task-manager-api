const router = require('express').Router()
const { registerController, loginController, refreshController, logoutController } = require('./auth.controller')
const { authenticate } = require('../../middleware/authenticate')

router.post('/register', registerController)
router.post('/login', loginController)
router.post('/refresh', refreshController)
router.post('/logout', authenticate, logoutController)

module.exports = router