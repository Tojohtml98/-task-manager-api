const router = require('express').Router({ mergeParams: true })
const {
  createTaskController,
  getTasksController,
  getTaskController,
  updateTaskController,
  deleteTaskController
} = require('./task.controller')

router.get('/', getTasksController)
router.post('/', createTaskController)
router.get('/:taskId', getTaskController)
router.patch('/:taskId', updateTaskController)
router.delete('/:taskId', deleteTaskController)

module.exports = router
