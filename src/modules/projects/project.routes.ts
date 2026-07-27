import { Router } from 'express'
import {
  createProjectController,
  getProjectsController,
  getProjectController,
  updateProjectController,
  deleteProjectController,
} from './project.controller'
import taskRoutes from '../tasks/task.routes'
import { validateBody } from '../../middleware/validate'
import { createProjectSchema, updateProjectSchema } from './project.schema'

const router = Router()

router.get('/', getProjectsController)
router.post('/', validateBody(createProjectSchema), createProjectController)
router.get('/:id', getProjectController)
router.patch('/:id', validateBody(updateProjectSchema), updateProjectController)
router.delete('/:id', deleteProjectController)

router.use('/:projectId/tasks', taskRoutes)

export default router
