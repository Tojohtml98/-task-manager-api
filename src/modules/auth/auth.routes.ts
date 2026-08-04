import { Router } from 'express'
import {
  registerController,
  loginController,
  refreshController,
  logoutController,
} from './auth.controller'
import { authenticate } from '../../middleware/authenticate'
import { validateBody } from '../../middleware/validate'
import { authRateLimiter } from '../../middleware/rateLimiter'
import { registerSchema, loginSchema, refreshSchema } from './auth.schema'

const router = Router()

router.post('/register', authRateLimiter, validateBody(registerSchema), registerController)
router.post('/login', authRateLimiter, validateBody(loginSchema), loginController)
router.post('/refresh', validateBody(refreshSchema), refreshController)
router.post('/logout', authenticate, logoutController)

export default router
