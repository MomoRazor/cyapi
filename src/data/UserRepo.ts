import { Connection, Model, ObjectId, Schema } from 'mongoose'
import { Community } from './CommunityRepo'
import { Team } from './TeamRepo'

export interface User {
    uid: string
    email: string
    displayName: string
    isAdmin: boolean
    teamIds: ObjectId[]
    communityIds: ObjectId[]
}

export interface ResolvedUser extends User {
    teams: Partial<Team>[]
    communities: Partial<Community>[]
}

const { String, Boolean, ObjectId } = Schema.Types

export type IUserRepo = Model<User>

const userSchema = new Schema(
    {
        uid: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true },
        displayName: { type: String, required: true, trim: true },
        isAdmin: { type: Boolean, required: false, default: false },
        teamIds: { type: [ObjectId], required: true, default: [] },
        communityIds: { type: [ObjectId], required: true, default: [] },
    },
    { timestamps: true }
)

userSchema.index(
    { uid: 1 },
    {
        unique: true,
    }
)
userSchema.index(
    { email: 1 },
    {
        unique: true,
    }
)

export const UserRepo = async (connection: Connection): Promise<IUserRepo> => {
    const userRepo = connection.model<User>('team', userSchema)
    await userRepo.syncIndexes()
    return userRepo
}
