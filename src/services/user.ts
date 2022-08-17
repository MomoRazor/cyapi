import { User, userRepo, communityRepo, teamRepo } from '../data'
import admin from 'firebase-admin'
import crypto from 'crypto'
import { BaseService } from './base'
import { FilterQuery } from 'mongoose'

export const UserService = () => {
    const baseService = BaseService<User>(userRepo)

    const resolve = async (document: User) => {
        return await resolveMemberCommunity(
            await resolveMemberTeam(await resolveGuideCommunities(document))
        )
    }

    const resolveMemberTeam = async (document: User) => {
        const teams = await teamRepo.find({
            memberIds: {
                $in: [document._id],
            },
        })

        if (!teams) {
            return document
        } else {
            return {
                ...document,
                teamMemberOf: teams,
            }
        }
    }

    const resolveMemberCommunity = async (document: User) => {
        const community = await communityRepo.findOne({
            memberIds: {
                $in: [document._id],
            },
        })

        if (!community) {
            return document
        } else {
            return {
                ...document,
                communityMemberOf: community,
            }
        }
    }

    const resolveGuideCommunities = async (document: User) => {
        const communities = await communityRepo.find({
            guideIds: {
                $in: [document._id],
            },
        })

        if (!communities) {
            return document
        } else {
            return {
                ...document,
                communitiesGuideOf: communities,
            }
        }
    }

    const getUserByUid = async (uid: string) => {
        const user = await userRepo.findOne({ uid })

        const userDoc = user?.toObject()

        if (!userDoc) {
            throw new Error('Failed to load User')
        }

        return await resolve(userDoc)
    }

    const upsertFirebaseUser = async (
        uid: string | undefined,
        user: {
            email: string
            password?: string
        }
    ) => {
        if (!user?.email) throw new Error(`Missing user details!`)

        // Update
        if (uid) {
            const firebaseUser = await admin.auth().updateUser(uid, user)
            return {
                user: firebaseUser,
            }
        }

        // Create
        try {
            const tempPass =
                user.password || crypto.randomBytes(10).toString(`hex`)

            const firebaseUser = await admin.auth().createUser({
                ...user,
                password: tempPass,
            })

            return {
                user: firebaseUser,
                password: tempPass,
            }
        } catch (e: any) {
            console.error(e.errorInfo.message)
            if (e.errorInfo.code === 'auth/email-already-exists') {
                const firebaseUser = await admin
                    .auth()
                    .getUserByEmail(user.email)
                return {
                    user: firebaseUser,
                }
            } else {
                throw e
            }
        }
    }

    const upsert = async (
        user: Partial<{
            _id?: string
            email: string
            password?: string
            displayName: string
            isAdmin: boolean
        }>
    ) => {
        // Update
        if (user?._id) {
            const mongoUser = await userRepo.findOne({ _id: user._id })
            if (!mongoUser) throw new Error(`User ${user._id} does not exist!`)
            if (user.email) {
                await upsertFirebaseUser(mongoUser.uid, {
                    email: user.email,
                })
            }
            const updatedUser = await userRepo.findOneAndUpdate(
                { _id: user._id },
                { $set: user },
                { new: true }
            )
            return updatedUser
        }

        // Create
        if (!user?.email) throw new Error(`Email is required!`)

        const creationResult = await upsertFirebaseUser(undefined, {
            email: user.email,
            password: user.password,
        })

        try {
            if (!creationResult) {
                console.info('No Email sent as user was already registered')
            }
        } catch (e) {
            console.error(e)
        }

        try {
            const mongoUser = await userRepo.create({
                ...user,
                uid: creationResult.user.uid,
            })

            return mongoUser
        } catch (e) {
            const mongoUser = await userRepo.findOne({
                uid: creationResult.user.uid,
            })

            if (mongoUser) {
                return await resolve(mongoUser.toObject())
            } else {
                return
            }
        }
    }

    const getById = async (_id: string) => {
        const user = await baseService.getById(_id)

        return await resolve(user)
    }

    const getMany = async (args: {
        limit?: number
        page?: number
        sort?: string
        search?: string[]
        filter?: FilterQuery<User>
    }) => {
        const users = await baseService.getMany(args)

        console.log(users)

        return {
            ...users,
            data: await Promise.all(
                users.data.map(
                    async (datum: any) =>
                        await resolveMemberTeam(
                            await resolveMemberCommunity(datum)
                        )
                )
            ),
        }
    }

    return { ...baseService, getMany, getById, getUserByUid, upsert }
}
