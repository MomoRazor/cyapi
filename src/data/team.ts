import { model, Schema } from 'mongoose'

export interface Team {
    _id: string
    name: string
}

const { String } = Schema.Types

const teamSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
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
