import { model, Schema } from 'mongoose'
import { Community } from './community'
import { Team } from './team'

export interface User {
    _id: string
    uid: string
    email: string
    displayName: string
    isAdmin: boolean
    communityMemberOf?: Community
    communitiesGuideOf?: Community[]
    teamMemberOf?: Team[]
}

const { String, Boolean } = Schema.Types

const userSchema = new Schema(
    {
        uid: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true },
        displayName: { type: String, required: true, trim: true },
        isAdmin: { type: Boolean, required: false, default: false },
        deleted: { type: Boolean, required: false, default: false },
    },
    { timestamps: true }
)

userSchema.index(
    { uid: 1 },
    {
        unique: true,
        partialFilterExpression: {
            deleted: false,
        },
    }
)
userSchema.index(
    { email: 1 },
    {
        unique: true,
        partialFilterExpression: {
            deleted: false,
        },
    }
)

export const UserRepo = () => model<User>(`user`, userSchema)
