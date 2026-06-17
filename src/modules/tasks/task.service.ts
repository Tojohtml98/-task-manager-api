import { HydratedDocument } from 'mongoose'
import taskRepo, { TaskInput } from './task.repository'
import projectRepo from '../projects/project.repository'
import { AppError } from '../../middleware/errorHandler'
import { ITask } from './task.model'

const assertProjectAccess = async (userId: string, projectId: string) => {
  const project = await projectRepo.findById(projectId)
  if (!project) throw new AppError('Project not found', 404)
  if (project.owner.toString() !== userId) throw new AppError('Forbidden', 403)
}

function assertTaskBelongs(
  task: HydratedDocument<ITask> | null,
  projectId: string
): asserts task is HydratedDocument<ITask> {
  if (!task || task.project.toString() !== projectId) throw new AppError('Task not found', 404)
}

const createTask = async (userId: string, projectId: string, data: TaskInput) => {
  await assertProjectAccess(userId, projectId)
  return taskRepo.create({ ...data, project: projectId })
}

const getTasks = async (userId: string, projectId: string) => {
  await assertProjectAccess(userId, projectId)
  return taskRepo.findByProject(projectId)
}

const getTask = async (userId: string, projectId: string, taskId: string) => {
  await assertProjectAccess(userId, projectId)
  const task = await taskRepo.findById(taskId)
  assertTaskBelongs(task, projectId)
  return task
}

const updateTask = async (userId: string, projectId: string, taskId: string, data: TaskInput) => {
  await assertProjectAccess(userId, projectId)
  const task = await taskRepo.findById(taskId)
  assertTaskBelongs(task, projectId)
  return taskRepo.update(taskId, data)
}

const deleteTask = async (userId: string, projectId: string, taskId: string) => {
  await assertProjectAccess(userId, projectId)
  const task = await taskRepo.findById(taskId)
  assertTaskBelongs(task, projectId)
  await taskRepo.remove(taskId)
}

export default { createTask, getTasks, getTask, updateTask, deleteTask }
