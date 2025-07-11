import { Connection, Model, Schema } from 'mongoose'

export interface Community {
    name: string
    guideIds: string[]
    memberIds: string[]
}

export interface ResolvedCommunity extends Community {}

const { String } = Schema.Types

export type ICommunityRepo = Model<Community>

const communitySchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        guideIds: { type: [String], required: true, trim: true },
        memberIds: { type: [String], required: true, trim: true },
    },
    { timestamps: true }
)

communitySchema.index(
    { name: 1 },
    {
        unique: true,
    }
)

export const CommunityRepo = async (
    connection: Connection
): Promise<ICommunityRepo> => {
    const communityRepo = connection.model<Community>(
        'community',
        communitySchema
    )
    await communityRepo.syncIndexes()
    return communityRepo
}
