const projectRepo = require('./project.repository')
const { AppError } = require('../../middleware/errorHandler')

const assertOwner = (project, userId) => {
  if (!project) throw new AppError('Project not found', 404)
  if (project.owner.toString() !== userId) throw new AppError('Forbidden', 403)
}

const createProject = (userId, data) =>
  projectRepo.create({ ...data, owner: userId })

const getProjects = (userId) =>
  projectRepo.findByOwner(userId)

const getProject = async (userId, projectId) => {
  const project = await projectRepo.findById(projectId)
  assertOwner(project, userId)
  return project
}

const updateProject = async (userId, projectId, data) => {
  const project = await projectRepo.findById(projectId)
  assertOwner(project, userId)
  return projectRepo.update(projectId, data)
}

const deleteProject = async (userId, projectId) => {
  const project = await projectRepo.findById(projectId)
  assertOwner(project, userId)
  await projectRepo.remove(projectId)
}

module.exports = { createProject, getProjects, getProject, updateProject, deleteProject }
