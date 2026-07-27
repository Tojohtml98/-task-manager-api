import { z } from 'zod'

// role queda fuera a proposito: si lo aceptaramos, cualquiera podria
// registrarse como admin mandando { role: 'admin' } en el body.
export const registerSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.email('Invalid email').trim().toLowerCase(),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128),
})

export const loginSchema = z.object({
  email: z.email('Invalid email').trim().toLowerCase(),
  password: z.string().min(1, 'Password is required'),
})

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
})
