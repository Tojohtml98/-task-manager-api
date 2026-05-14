const request = require('supertest')
const app = require('../app')

const registerUser = async (overrides = {}) => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Test User', email: 'test@example.com', password: 'password123', ...overrides })
  return res.body
}

const createProject = async (token, overrides = {}) => {
  const res = await request(app)
    .post('/api/projects')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Test Project', description: 'A project', ...overrides })
  return res.body
}

const createTask = async (token, projectId, overrides = {}) => {
  const res = await request(app)
    .post(`/api/projects/${projectId}/tasks`)
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Test Task', ...overrides })
  return res.body
}

module.exports = { registerUser, createProject, createTask }
