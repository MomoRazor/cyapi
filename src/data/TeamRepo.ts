import { Connection, Model, Schema } from 'mongoose'

export interface Team {
    name: string
    memberIds: string[]
}

export interface ResolvedTeam extends Team {}

const { String, ObjectId } = Schema.Types

export type ITeamRepo = Model<Team>

const teamSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        memberIds: { type: [ObjectId], required: true, trim: true },
    },
    { timestamps: true }
)

teamSchema.index(
    { name: 1 },
    {
        unique: true,
    }
)

export const TeamRepo = async (connection: Connection): Promise<ITeamRepo> => {
    const teamRepo = connection.model<Team>('team', teamSchema)
    await teamRepo.syncIndexes()
    return teamRepo
}
