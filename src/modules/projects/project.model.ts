import mongoose, { Schema, Types } from 'mongoose'

export interface IProject {
  name: string
  description: string
  status: 'active' | 'archived'
  owner: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const projectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    status: { type: String, enum: ['active', 'archived'], default: 'active' },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

export default mongoose.model<IProject>('Project', projectSchema)
