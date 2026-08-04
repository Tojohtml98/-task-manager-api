import { Request, Response, NextFunction } from 'express'
import { Types } from 'mongoose'
import { z, ZodType } from 'zod'
import { AppError } from './errorHandler'

// Reusable en cualquier schema de params que reciba un :id de Mongo.
// Sin esto, un id con formato invalido llega crudo a Mongoose y el CastError
// que tira no tiene statusCode -> cae al 500 generico del errorHandler.
export const objectIdSchema = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid id',
})

const formatIssues = (issues: { path: PropertyKey[]; message: string }[], fallback: string) =>
  issues.map((issue) => `${issue.path.join('.') || fallback}: ${issue.message}`).join(', ')

// Valida req.body contra un schema de zod antes de llegar al controller.
// Si falla, corta con 400 y el detalle por campo.
export const validateBody =
  (schema: ZodType) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      throw new AppError(`Validation failed - ${formatIssues(result.error.issues, 'body')}`, 400)
    }

    req.body = result.data
    next()
  }

// Idem para req.params (ids de ruta tipo :id, :projectId, :taskId).
export const validateParams =
  (schema: ZodType) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params)

    if (!result.success) {
      throw new AppError(`Validation failed - ${formatIssues(result.error.issues, 'params')}`, 400)
    }

    next()
  }
