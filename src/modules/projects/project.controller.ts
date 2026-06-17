import { Request, Response } from 'express'
import projectService from './project.service'

export const createProjectController = async (req: Request, res: Response): Promise<void> => {
  const project = await projectService.createProject(req.user.id, req.body)
  res.status(201).json(project)
}

export const getProjectsController = async (req: Request, res: Response): Promise<void> => {
  const projects = await projectService.getProjects(req.user.id)
  res.json(projects)
}

export const getProjectController = async (req: Request, res: Response): Promise<void> => {
  const project = await projectService.getProject(req.user.id, req.params.id)
  res.json(project)
}

export const updateProjectController = async (req: Request, res: Response): Promise<void> => {
  const project = await projectService.updateProject(req.user.id, req.params.id, req.body)
  res.json(project)
}

export const deleteProjectController = async (req: Request, res: Response): Promise<void> => {
  await projectService.deleteProject(req.user.id, req.params.id)
  res.status(204).send()
}
