import { Router } from 'express'
import {
  createProjectController,
  getProjectsController,
  getProjectController,
  updateProjectController,
  deleteProjectController,
} from './project.controller'
import taskRoutes from '../tasks/task.routes'

const router = Router()

router.get('/', getProjectsController)
router.post('/', createProjectController)
router.get('/:id', getProjectController)
router.patch('/:id', updateProjectController)
router.delete('/:id', deleteProjectController)

router.use('/:projectId/tasks', taskRoutes)

export default router
