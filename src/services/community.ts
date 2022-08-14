import { BaseService } from './base'
import { Community, communityRepo, User, userRepo } from '../data'
import { FilterQuery } from 'mongoose'

export const CommunityService = () => {
    const baseService = BaseService<Community>(communityRepo)

    const getCommunityGuides = async (
        {
            limit = 10,
            page = 1,
            sort = ``,
            search = [],
            filter = {},
        }: {
            limit?: number
            page?: number
            sort?: string
            search?: string[]
            filter?: FilterQuery<User>
        },
        communityId: string
    ) => {
        const community = await communityRepo.findById(communityId)

        if (!community) {
            throw new Error('Could not find Community')
        }

        page = page < 1 ? 1 : page
        limit = limit < 0 ? 0 : limit

        const query: any = {
            ...filter,
            _id: {
                $in: community.guideIds,
            },
            deleted: false,
        }

        const searchQuery: any[] = []
        for (const element of search) {
            const [key, value] = element.split(`:`)
            if (!key || !value) continue
            searchQuery.push({ [key]: { $regex: `${value}`, $options: `i` } })
        }
        if (searchQuery.length > 0) query[`$or`] = searchQuery

        const data = await userRepo
            .find(query)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit)

        const count = await userRepo.countDocuments(query)

        return {
            data: data.map((datum: any) => datum.toObject()),
            count,
            page,
            limit,
        }
    }

    const getCommunityMembers = async (
        {
            limit = 10,
            page = 1,
            sort = ``,
            search = [],
            filter = {},
        }: {
            limit?: number
            page?: number
            sort?: string
            search?: string[]
            filter?: FilterQuery<User>
        },
        communityId: string
    ) => {
        const community = await communityRepo.findById(communityId)

        if (!community) {
            throw new Error('Could not find Community')
        }

        page = page < 1 ? 1 : page
        limit = limit < 0 ? 0 : limit

        const query: any = {
            ...filter,
            _id: {
                $in: community.memberIds,
            },
            deleted: false,
        }

        const searchQuery: any[] = []
        for (const element of search) {
            const [key, value] = element.split(`:`)
            if (!key || !value) continue
            searchQuery.push({ [key]: { $regex: `${value}`, $options: `i` } })
        }
        if (searchQuery.length > 0) query[`$or`] = searchQuery

        const data = await userRepo
            .find(query)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit)

        const count = await userRepo.countDocuments(query)

        return {
            data: data.map((datum: any) => datum.toObject()),
            count,
            page,
            limit,
        }
    }

    const assignMember = async (userId: string, communityId: string) => {
        //check if user is already in a Community
        const check = await communityRepo.find({
            memberIds: {
                $in: [userId],
            },
        })

        if (check && check.length > 0) {
            throw new Error('User is already a member of a community')
        }

        const assignment = await communityRepo.updateOne(
            {
                _id: communityId,
            },
            {
                $addToSet: {
                    memberIds: userId,
                },
            }
        )

        if (!assignment) {
            throw new Error('Failed to assign member')
        }

        return assignment
    }

    const unassignMember = async (userId: string, communityId: string) => {
        const assignment = await communityRepo.updateOne(
            {
                _id: communityId,
            },
            {
                $pull: {
                    memberIds: userId,
                },
            }
        )

        if (!assignment) {
            throw new Error('Failed to unassign mamber')
        }

        return assignment
    }

    const assignGuide = async (userId: string, communityId: string) => {
        const assignment = await communityRepo.updateOne(
            {
                _id: communityId,
            },
            {
                $addToSet: {
                    guideIds: userId,
                },
            }
        )

        if (!assignment) {
            throw new Error('Failed to assign guide')
        }

        return assignment
    }

    const unassignGuide = async (userId: string, communityId: string) => {
        const assignment = await communityRepo.updateOne(
            {
                _id: communityId,
            },
            {
                $pull: {
                    guideIds: userId,
                },
            }
        )

        if (!assignment) {
            throw new Error('Failed to unassign mamber')
        }

        return assignment
    }

    return {
        ...baseService,
        getCommunityGuides,
        getCommunityMembers,
        assignMember,
        unassignMember,
        assignGuide,
        unassignGuide,
    }
}
