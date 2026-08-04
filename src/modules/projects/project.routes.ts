import { Router } from 'express'
import {
  createProjectController,
  getProjectsController,
  getProjectController,
  updateProjectController,
  deleteProjectController,
} from './project.controller'
import taskRoutes from '../tasks/task.routes'
import { validateBody, validateParams } from '../../middleware/validate'
import { createProjectSchema, updateProjectSchema, projectParamsSchema } from './project.schema'
import { projectIdParamsSchema } from '../tasks/task.schema'

const router = Router()

router.get('/', getProjectsController)
router.post('/', validateBody(createProjectSchema), createProjectController)
router.get('/:id', validateParams(projectParamsSchema), getProjectController)
router.patch(
  '/:id',
  validateParams(projectParamsSchema),
  validateBody(updateProjectSchema),
  updateProjectController
)
router.delete('/:id', validateParams(projectParamsSchema), deleteProjectController)

router.use('/:projectId/tasks', validateParams(projectIdParamsSchema), taskRoutes)

export default router
