const taskRepo = require('./task.repository')
const projectRepo = require('../projects/project.repository')
const { AppError } = require('../../middleware/errorHandler')

const assertProjectAccess = async (userId, projectId) => {
  const project = await projectRepo.findById(projectId)
  if (!project) throw new AppError('Project not found', 404)
  if (project.owner.toString() !== userId) throw new AppError('Forbidden', 403)
}

const assertTaskBelongs = (task, projectId) => {
  if (!task || task.project.toString() !== projectId) throw new AppError('Task not found', 404)
}

const createTask = async (userId, projectId, data) => {
  await assertProjectAccess(userId, projectId)
  return taskRepo.create({ ...data, project: projectId })
}

const getTasks = async (userId, projectId) => {
  await assertProjectAccess(userId, projectId)
  return taskRepo.findByProject(projectId)
}

const getTask = async (userId, projectId, taskId) => {
  await assertProjectAccess(userId, projectId)
  const task = await taskRepo.findById(taskId)
  assertTaskBelongs(task, projectId)
  return task
}

const updateTask = async (userId, projectId, taskId, data) => {
  await assertProjectAccess(userId, projectId)
  const task = await taskRepo.findById(taskId)
  assertTaskBelongs(task, projectId)
  return taskRepo.update(taskId, data)
}

const deleteTask = async (userId, projectId, taskId) => {
  await assertProjectAccess(userId, projectId)
  const task = await taskRepo.findById(taskId)
  assertTaskBelongs(task, projectId)
  await taskRepo.remove(taskId)
}

module.exports = { createTask, getTasks, getTask, updateTask, deleteTask }
