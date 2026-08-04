import { Router } from 'express'
import {
  createTaskController,
  getTasksController,
  getTaskController,
  updateTaskController,
  deleteTaskController,
} from './task.controller'
import { validateBody, validateParams } from '../../middleware/validate'
import { createTaskSchema, updateTaskSchema, taskParamsSchema } from './task.schema'

const router = Router({ mergeParams: true })

router.get('/', getTasksController)
router.post('/', validateBody(createTaskSchema), createTaskController)
router.get('/:taskId', validateParams(taskParamsSchema), getTaskController)
router.patch(
  '/:taskId',
  validateParams(taskParamsSchema),
  validateBody(updateTaskSchema),
  updateTaskController
)
router.delete('/:taskId', validateParams(taskParamsSchema), deleteTaskController)

export default router
