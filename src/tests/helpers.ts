import request from 'supertest'
import app from '../app'

type Overrides = Record<string, unknown>

export const registerUser = async (overrides: Overrides = {}) => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Test User', email: 'test@example.com', password: 'password123', ...overrides })
  return res.body
}

export const createProject = async (token: string, overrides: Overrides = {}) => {
  const res = await request(app)
    .post('/api/projects')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Test Project', description: 'A project', ...overrides })
  return res.body
}

export const createTask = async (token: string, projectId: string, overrides: Overrides = {}) => {
  const res = await request(app)
    .post(`/api/projects/${projectId}/tasks`)
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Test Task', ...overrides })
  return res.body
}
