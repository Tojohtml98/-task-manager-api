const authService = require('./auth.service')

const registerController = async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.register(req.body)
  res.status(201).json({ user, accessToken, refreshToken })
}

const loginController = async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body)
  res.json({ user, accessToken, refreshToken })
}

const refreshController = async (req, res) => {
  const tokens = await authService.refresh(req.body.refreshToken)
  res.json(tokens)
}

const logoutController = async (req, res) => {
  await authService.logout(req.user.id)
  res.json({ message: 'Logged out' })
}

module.exports = { registerController, loginController, refreshController, logoutController }