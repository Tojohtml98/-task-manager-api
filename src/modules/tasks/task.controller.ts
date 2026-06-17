import { Request, Response } from 'express'
import taskService from './task.service'

export const createTaskController = async (req: Request, res: Response): Promise<void> => {
  const task = await taskService.createTask(req.user.id, req.params.projectId, req.body)
  res.status(201).json(task)
}

export const getTasksController = async (req: Request, res: Response): Promise<void> => {
  const tasks = await taskService.getTasks(req.user.id, req.params.projectId)
  res.json(tasks)
}

export const getTaskController = async (req: Request, res: Response): Promise<void> => {
  const task = await taskService.getTask(req.user.id, req.params.projectId, req.params.taskId)
  res.json(task)
}

export const updateTaskController = async (req: Request, res: Response): Promise<void> => {
  const task = await taskService.updateTask(
    req.user.id,
    req.params.projectId,
    req.params.taskId,
    req.body
  )
  res.json(task)
}

export const deleteTaskController = async (req: Request, res: Response): Promise<void> => {
  await taskService.deleteTask(req.user.id, req.params.projectId, req.params.taskId)
  res.status(204).send()
}
