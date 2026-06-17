import { HydratedDocument } from 'mongoose'
import projectRepo, { ProjectInput } from './project.repository'
import { AppError } from '../../middleware/errorHandler'
import { IProject } from './project.model'

function assertOwner(
  project: HydratedDocument<IProject> | null,
  userId: string
): asserts project is HydratedDocument<IProject> {
  if (!project) throw new AppError('Project not found', 404)
  if (project.owner.toString() !== userId) throw new AppError('Forbidden', 403)
}

const createProject = (userId: string, data: ProjectInput) =>
  projectRepo.create({ ...data, owner: userId })

const getProjects = (userId: string) => projectRepo.findByOwner(userId)

const getProject = async (userId: string, projectId: string) => {
  const project = await projectRepo.findById(projectId)
  assertOwner(project, userId)
  return project
}

const updateProject = async (userId: string, projectId: string, data: ProjectInput) => {
  const project = await projectRepo.findById(projectId)
  assertOwner(project, userId)
  return projectRepo.update(projectId, data)
}

const deleteProject = async (userId: string, projectId: string) => {
  const project = await projectRepo.findById(projectId)
  assertOwner(project, userId)
  await projectRepo.remove(projectId)
}

export default { createProject, getProjects, getProject, updateProject, deleteProject }
