const router = require('express').Router()
const {
  createProjectController,
  getProjectsController,
  getProjectController,
  updateProjectController,
  deleteProjectController
} = require('./project.controller')
const taskRoutes = require('../tasks/task.routes')

router.get('/', getProjectsController)
router.post('/', createProjectController)
router.get('/:id', getProjectController)
router.patch('/:id', updateProjectController)
router.delete('/:id', deleteProjectController)

router.use('/:projectId/tasks', taskRoutes)

module.exports = router
