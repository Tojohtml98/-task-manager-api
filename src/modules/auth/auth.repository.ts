import User from './user.model'

export interface UserInput {
  name: string
  email: string
  password: string
}

const create = (data: UserInput) => User.create(data)
const findByEmail = (email: string) => User.findOne({ email })
const findById = (id: string) => User.findById(id)
const updateRefreshToken = (id: string, refreshToken: string | null) =>
  User.findByIdAndUpdate(id, { refreshToken }, { returnDocument: 'after', runValidators: true })

export default { create, findByEmail, findById, updateRefreshToken }
