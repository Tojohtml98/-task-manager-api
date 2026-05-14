const Project = require('./project.model')

const create = (data) => Project.create(data)
const findById = (id) => Project.findById(id)
const findByOwner = (ownerId) => Project.find({ owner: ownerId }).sort({ createdAt: -1 })
const update = (id, data) => Project.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true })
const remove = (id) => Project.findByIdAndDelete(id)

module.exports = { create, findById, findByOwner, update, remove }
