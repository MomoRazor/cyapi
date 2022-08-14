import { BaseService } from './base'
import { Team, teamRepo, User } from '../data'
import { FilterQuery } from 'mongoose'

export const TeamService = () => {
    const baseService = BaseService<Team>(teamRepo)

    const getTeamMembers = async (
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
        teamId: string
    ) => {
        const team = await teamRepo.findById(teamId)

        if (!team) {
            throw new Error('Could not find Team')
        }

        page = page < 1 ? 1 : page
        limit = limit < 0 ? 0 : limit

        const query: any = {
            ...filter,
            _id: {
                $in: team.memberIds,
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

        const data = await teamRepo
            .find(query)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit)

        const count = await teamRepo.countDocuments(query)

        return {
            data: data.map((datum: any) => datum.toObject()),
            count,
            page,
            limit,
        }
    }

    const assignMember = async (userId: string, teamId: string) => {
        const assignment = await teamRepo.updateOne(
            {
                _id: teamId,
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

    const unassignMember = async (userId: string, teamId: string) => {
        const assignment = await teamRepo.updateOne(
            {
                _id: teamId,
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

    return { ...baseService, getTeamMembers, assignMember, unassignMember }
}
