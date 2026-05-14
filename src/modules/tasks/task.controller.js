const taskService = require('./task.service')

const createTaskController = async (req, res) => {
  const task = await taskService.createTask(req.user.id, req.params.projectId, req.body)
  res.status(201).json(task)
}

const getTasksController = async (req, res) => {
  const tasks = await taskService.getTasks(req.user.id, req.params.projectId)
  res.json(tasks)
}

const getTaskController = async (req, res) => {
  const task = await taskService.getTask(req.user.id, req.params.projectId, req.params.taskId)
  res.json(task)
}

const updateTaskController = async (req, res) => {
  const task = await taskService.updateTask(req.user.id, req.params.projectId, req.params.taskId, req.body)
  res.json(task)
}

const deleteTaskController = async (req, res) => {
  await taskService.deleteTask(req.user.id, req.params.projectId, req.params.taskId)
  res.status(204).send()
}

module.exports = {
  createTaskController,
  getTasksController,
  getTaskController,
  updateTaskController,
  deleteTaskController
}
