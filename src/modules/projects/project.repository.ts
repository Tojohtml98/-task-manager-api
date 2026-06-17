import { Types } from 'mongoose'
import Project from './project.model'

export interface ProjectInput {
  name?: string
  description?: string
  status?: 'active' | 'archived'
  owner?: Types.ObjectId | string
}

const create = (data: ProjectInput) => Project.create(data)
const findById = (id: string) => Project.findById(id)
const findByOwner = (ownerId: string) => Project.find({ owner: ownerId }).sort({ createdAt: -1 })
const update = (id: string, data: ProjectInput) =>
  Project.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true })
const remove = (id: string) => Project.findByIdAndDelete(id)

export default { create, findById, findByOwner, update, remove }
