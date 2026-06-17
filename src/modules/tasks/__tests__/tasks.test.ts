import request from 'supertest'
import app from '../../../app'
import { registerUser, createProject, createTask } from '../../../tests/helpers'

let token: string
let otherToken: string
let projectId: string

beforeEach(async () => {
  ;({ accessToken: token } = await registerUser())
  ;({ accessToken: otherToken } = await registerUser({ email: 'other@example.com' }))
  ;({ _id: projectId } = await createProject(token))
})

const tasksUrl = () => `/api/projects/${projectId}/tasks`

describe('POST /api/projects/:projectId/tasks', () => {
  it('creates a task in the project', async () => {
    const res = await request(app)
      .post(tasksUrl())
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Fix bug', priority: 'high' })

    expect(res.status).toBe(201)
    expect(res.body.title).toBe('Fix bug')
    expect(res.body.priority).toBe('high')
    expect(res.body.status).toBe('todo')
    expect(res.body.project).toBe(projectId)
  })

  it('returns 403 for a project not owned by the user', async () => {
    const res = await request(app)
      .post(tasksUrl())
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ title: 'Hijack task' })

    expect(res.status).toBe(403)
  })

  it('returns 404 for a non-existent project', async () => {
    const res = await request(app)
      .post('/api/projects/507f1f77bcf86cd799439011/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Ghost task' })

    expect(res.status).toBe(404)
  })
})

describe('GET /api/projects/:projectId/tasks', () => {
  it('returns all tasks for the project', async () => {
    await createTask(token, projectId, { title: 'Task 1' })
    await createTask(token, projectId, { title: 'Task 2' })

    const res = await request(app).get(tasksUrl()).set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(2)
  })

  it('returns 403 for a project not owned by the user', async () => {
    const res = await request(app).get(tasksUrl()).set('Authorization', `Bearer ${otherToken}`)

    expect(res.status).toBe(403)
  })
})

describe('GET /api/projects/:projectId/tasks/:taskId', () => {
  it('returns a specific task', async () => {
    const task = await createTask(token, projectId)

    const res = await request(app)
      .get(`${tasksUrl()}/${task._id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body._id).toBe(task._id)
  })

  it('returns 404 for a task not in the project', async () => {
    const otherProject = await createProject(token, { name: 'Other' })
    const task = await createTask(token, otherProject._id)

    const res = await request(app)
      .get(`${tasksUrl()}/${task._id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(404)
  })
})

describe('PATCH /api/projects/:projectId/tasks/:taskId', () => {
  it('updates a task', async () => {
    const task = await createTask(token, projectId)

    const res = await request(app)
      .patch(`${tasksUrl()}/${task._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'in-progress', title: 'Updated task' })

    expect(res.status).toBe(200)
    expect(res.body.status).toBe('in-progress')
    expect(res.body.title).toBe('Updated task')
  })

  it('returns 403 when another user tries to update', async () => {
    const task = await createTask(token, projectId)

    const res = await request(app)
      .patch(`${tasksUrl()}/${task._id}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ status: 'done' })

    expect(res.status).toBe(403)
  })
})

describe('DELETE /api/projects/:projectId/tasks/:taskId', () => {
  it('deletes a task and returns 204', async () => {
    const task = await createTask(token, projectId)

    const res = await request(app)
      .delete(`${tasksUrl()}/${task._id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(204)
  })

  it('returns 403 when another user tries to delete', async () => {
    const task = await createTask(token, projectId)

    const res = await request(app)
      .delete(`${tasksUrl()}/${task._id}`)
      .set('Authorization', `Bearer ${otherToken}`)

    expect(res.status).toBe(403)
  })
})
