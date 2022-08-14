import { model, Schema } from 'mongoose'

export interface Community {
    _id: string
    name: string
    memberIds: string[]
    guideIds: string[]
}

const { String } = Schema.Types

const communitySchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        memberIds: { type: [String], required: true, default: [] },
        guideIds: { type: [String], required: true, default: [] },
        deleted: { type: Boolean, required: false, default: false },
    },
    { timestamps: true }
)

communitySchema.index(
    { name: 1 },
    {
        unique: true,
        partialFilterExpression: {
            deleted: false,
        },
    }
)

export const CommunityRepo = () =>
    model<Community>(`community`, communitySchema)
