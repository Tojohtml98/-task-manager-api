const request = require('supertest')
const app = require('../../../app')
const { registerUser, createProject } = require('../../../tests/helpers')

const BASE = '/api/projects'

let token
let otherToken

beforeEach(async () => {
  ;({ accessToken: token } = await registerUser())
  ;({ accessToken: otherToken } = await registerUser({ email: 'other@example.com' }))
})

describe('POST /api/projects', () => {
  it('creates a project for the authenticated user', async () => {
    const res = await request(app)
      .post(BASE)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'My Project', description: 'A test project' })

    expect(res.status).toBe(201)
    expect(res.body.name).toBe('My Project')
    expect(res.body).toHaveProperty('owner')
  })

  it('returns 401 without a token', async () => {
    const res = await request(app).post(BASE).send({ name: 'No Auth' })
    expect(res.status).toBe(401)
  })
})

describe('GET /api/projects', () => {
  it('returns only the authenticated user\'s projects', async () => {
    await createProject(token, { name: 'P1' })
    await createProject(token, { name: 'P2' })
    await createProject(otherToken, { name: 'Other project' })

    const res = await request(app)
      .get(BASE)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(2)
  })
})

describe('GET /api/projects/:id', () => {
  it('returns a project owned by the user', async () => {
    const project = await createProject(token)

    const res = await request(app)
      .get(`${BASE}/${project._id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body._id).toBe(project._id)
  })

  it('returns 403 when another user tries to access the project', async () => {
    const project = await createProject(token)

    const res = await request(app)
      .get(`${BASE}/${project._id}`)
      .set('Authorization', `Bearer ${otherToken}`)

    expect(res.status).toBe(403)
  })

  it('returns 404 for a non-existent project', async () => {
    const res = await request(app)
      .get(`${BASE}/507f1f77bcf86cd799439011`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(404)
  })
})

describe('PATCH /api/projects/:id', () => {
  it('updates a project', async () => {
    const project = await createProject(token)

    const res = await request(app)
      .patch(`${BASE}/${project._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Renamed', status: 'archived' })

    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Renamed')
    expect(res.body.status).toBe('archived')
  })

  it('returns 403 when another user tries to update', async () => {
    const project = await createProject(token)

    const res = await request(app)
      .patch(`${BASE}/${project._id}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ name: 'Hijacked' })

    expect(res.status).toBe(403)
  })
})

describe('DELETE /api/projects/:id', () => {
  it('deletes a project and returns 204', async () => {
    const project = await createProject(token)

    const res = await request(app)
      .delete(`${BASE}/${project._id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(204)
  })

  it('returns 403 when another user tries to delete', async () => {
    const project = await createProject(token)

    const res = await request(app)
      .delete(`${BASE}/${project._id}`)
      .set('Authorization', `Bearer ${otherToken}`)

    expect(res.status).toBe(403)
  })
})
