import { z } from 'zod'
import { objectIdSchema } from '../../middleware/validate'

export const projectIdParamsSchema = z.object({ projectId: objectIdSchema })
export const taskParamsSchema = z.object({ projectId: objectIdSchema, taskId: objectIdSchema })

const status = z.enum(['todo', 'in-progress', 'done'])
const priority = z.enum(['low', 'medium', 'high'])

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  description: z.string().trim().max(2000).optional(),
  status: status.optional(),
  priority: priority.optional(),
  dueDate: z.coerce.date().nullable().optional(),
})

export const updateTaskSchema = createTaskSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  })
