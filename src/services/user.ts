import { User, userRepo } from '../data'
import admin from 'firebase-admin'
import crypto from 'crypto'
import { BaseService } from './base'

export const UserService = () => {
    const baseService = BaseService<User>(userRepo)

    const getUserByUid = async (uid: string) => {
        return (await userRepo.findOne({ uid }))?.toObject()
    }

    const upsertFirebaseUser = async (
        uid: string | undefined,
        user: {
            email: string
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
            const tempPass = crypto.randomBytes(10).toString(`hex`)

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
            return mongoUser
        }
    }

    return { ...baseService, getUserByUid, upsert }
}
