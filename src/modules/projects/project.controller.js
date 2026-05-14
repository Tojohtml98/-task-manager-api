const projectService = require('./project.service')

const createProjectController = async (req, res) => {
  const project = await projectService.createProject(req.user.id, req.body)
  res.status(201).json(project)
}

const getProjectsController = async (req, res) => {
  const projects = await projectService.getProjects(req.user.id)
  res.json(projects)
}

const getProjectController = async (req, res) => {
  const project = await projectService.getProject(req.user.id, req.params.id)
  res.json(project)
}

const updateProjectController = async (req, res) => {
  const project = await projectService.updateProject(req.user.id, req.params.id, req.body)
  res.json(project)
}

const deleteProjectController = async (req, res) => {
  await projectService.deleteProject(req.user.id, req.params.id)
  res.status(204).send()
}

module.exports = {
  createProjectController,
  getProjectsController,
  getProjectController,
  updateProjectController,
  deleteProjectController
}
