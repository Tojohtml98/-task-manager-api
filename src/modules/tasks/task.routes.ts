import { Router } from 'express'
import {
  createTaskController,
  getTasksController,
  getTaskController,
  updateTaskController,
  deleteTaskController,
} from './task.controller'
import { validateBody } from '../../middleware/validate'
import { createTaskSchema, updateTaskSchema } from './task.schema'

const router = Router({ mergeParams: true })

router.get('/', getTasksController)
router.post('/', validateBody(createTaskSchema), createTaskController)
router.get('/:taskId', getTaskController)
router.patch('/:taskId', validateBody(updateTaskSchema), updateTaskController)
router.delete('/:taskId', deleteTaskController)

export default router
