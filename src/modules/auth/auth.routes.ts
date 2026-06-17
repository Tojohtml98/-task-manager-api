import { Router } from 'express'
import {
  registerController,
  loginController,
  refreshController,
  logoutController,
} from './auth.controller'
import { authenticate } from '../../middleware/authenticate'

const router = Router()

router.post('/register', registerController)
router.post('/login', loginController)
router.post('/refresh', refreshController)
router.post('/logout', authenticate, logoutController)

export default router
