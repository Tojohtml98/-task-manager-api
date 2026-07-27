import request from 'supertest'
import app from '../../../app'

const BASE = '/api/auth'

describe('POST /api/auth/register', () => {
  it('registers a new user and returns tokens', async () => {
    const res = await request(app)
      .post(`${BASE}/register`)
      .send({ name: 'Alice', email: 'alice@example.com', password: 'secret123' })

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('accessToken')
    expect(res.body).toHaveProperty('refreshToken')
    expect(res.body.user.email).toBe('alice@example.com')
    expect(res.body.user).not.toHaveProperty('password')
  })

  it('rejects duplicate email with 400', async () => {
    const payload = { name: 'Bob', email: 'bob@example.com', password: 'secret123' }
    await request(app).post(`${BASE}/register`).send(payload)

    const res = await request(app).post(`${BASE}/register`).send(payload)
    expect(res.status).toBe(400)
  })
})

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app)
      .post(`${BASE}/register`)
      .send({ name: 'Carol', email: 'carol@example.com', password: 'secret123' })
  })

  it('returns tokens on valid credentials', async () => {
    const res = await request(app)
      .post(`${BASE}/login`)
      .send({ email: 'carol@example.com', password: 'secret123' })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('accessToken')
  })

  it('rejects invalid password with 401', async () => {
    const res = await request(app)
      .post(`${BASE}/login`)
      .send({ email: 'carol@example.com', password: 'wrongpass' })

    expect(res.status).toBe(401)
  })

  it('rejects unknown email with 401', async () => {
    const res = await request(app)
      .post(`${BASE}/login`)
      .send({ email: 'nobody@example.com', password: 'secret123' })

    expect(res.status).toBe(401)
  })
})

describe('POST /api/auth/refresh', () => {
  it('returns new tokens for a valid refresh token', async () => {
    const { refreshToken } = (
      await request(app)
        .post(`${BASE}/register`)
        .send({ name: 'Dave', email: 'dave@example.com', password: 'secret123' })
    ).body

    const res = await request(app).post(`${BASE}/refresh`).send({ refreshToken })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('accessToken')
  })

  it('rejects an invalid refresh token with 401', async () => {
    const res = await request(app)
      .post(`${BASE}/refresh`)
      .send({ refreshToken: 'invalid.token.here' })

    expect(res.status).toBe(401)
  })
})

describe('POST /api/auth/logout', () => {
  it('logs out an authenticated user', async () => {
    const { accessToken } = (
      await request(app)
        .post(`${BASE}/register`)
        .send({ name: 'Eve', email: 'eve@example.com', password: 'secret123' })
    ).body

    const res = await request(app)
      .post(`${BASE}/logout`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(res.status).toBe(200)
  })

  it('rejects unauthenticated logout with 401', async () => {
    const res = await request(app).post(`${BASE}/logout`)
    expect(res.status).toBe(401)
  })
})

describe('validación de body', () => {
  it('returns 400 for an invalid email on register', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Tomas', email: 'no-es-un-mail', password: 'secret123' })

    expect(res.status).toBe(400)
    expect(res.body.error.message).toMatch(/email/i)
  })

  it('returns 400 for a password shorter than 6 chars', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Tomas', email: 'corto@example.com', password: '123' })

    expect(res.status).toBe(400)
    expect(res.body.error.message).toMatch(/password/i)
  })

  it('does not allow privilege escalation via role in the body', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Hacker',
        email: 'hacker@example.com',
        password: 'secret123',
        role: 'admin',
      })

    expect(res.status).toBe(201)
    expect(res.body.user.role).toBe('user')
  })

  it('returns 400 when refreshToken is missing', async () => {
    const res = await request(app).post('/api/auth/refresh').send({})

    expect(res.status).toBe(400)
    expect(res.body.error.message).toMatch(/refresh/i)
  })
})
