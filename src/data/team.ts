import { model, Schema } from 'mongoose'

export interface Team {
    _id: string
    name: string
    memberIds: string[]
}

const { String } = Schema.Types

const teamSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        memberIds: { type: [String], required: true, default: [] },
        deleted: { type: Boolean, required: false, default: false },
    },
    { timestamps: true }
)

teamSchema.index(
    { name: 1 },
    {
        unique: true,
        partialFilterExpression: {
            deleted: false,
        },
    }
)

export const TeamRepo = () => model<Team>(`team`, teamSchema)
