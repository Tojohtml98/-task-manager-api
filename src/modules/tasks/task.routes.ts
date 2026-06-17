import { Router } from 'express'
import {
  createTaskController,
  getTasksController,
  getTaskController,
  updateTaskController,
  deleteTaskController,
} from './task.controller'

const router = Router({ mergeParams: true })

router.get('/', getTasksController)
router.post('/', createTaskController)
router.get('/:taskId', getTaskController)
router.patch('/:taskId', updateTaskController)
router.delete('/:taskId', deleteTaskController)

export default router
