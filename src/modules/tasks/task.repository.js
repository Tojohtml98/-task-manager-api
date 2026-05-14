const Task = require('./task.model')

const create = (data) => Task.create(data)
const findById = (id) => Task.findById(id)
const findByProject = (projectId) => Task.find({ project: projectId }).sort({ createdAt: -1 })
const update = (id, data) => Task.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true })
const remove = (id) => Task.findByIdAndDelete(id)

module.exports = { create, findById, findByProject, update, remove }
