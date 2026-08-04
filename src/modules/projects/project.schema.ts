import { z } from 'zod'
import { objectIdSchema } from '../../middleware/validate'

export const projectParamsSchema = z.object({ id: objectIdSchema })

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  description: z.string().trim().max(2000).optional(),
  status: z.enum(['active', 'archived']).optional(),
})

export const updateProjectSchema = createProjectSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  })
