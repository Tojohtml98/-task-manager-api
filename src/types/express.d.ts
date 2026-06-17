import { AuthPayload } from './index'

// Extiende el Request de Express para que req.user esté tipado
// en todos los controllers que corren detrás del middleware authenticate.
declare global {
  namespace Express {
    interface Request {
      user: AuthPayload
    }
  }
}

export {}
