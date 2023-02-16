import { AutocompleteFilter, PaginationFilter } from '../data/general'
import { ITeamRepo, IUserRepo, Team } from '../data'

export interface ITeamSvc {
    getTable: (
        pagination: PaginationFilter
    ) => Promise<{ data: Team[]; total: number }>
    getAutocomplete: (info: AutocompleteFilter) => Promise<{ data: Team[] }>
    getById: (teamId: string) => Promise<Team>
    update: (teamId: string, data: Partial<Team>) => Promise<Team>
    create: (data: Team) => Promise<Team>
    deleteOne: (teamId: string) => Promise<void>
    assignMember: (userId: string, communityId: string) => Promise<Team>
    unassignMember: (userId: string, communityId: string) => Promise<Team>
}

export const TeamSvc = (teamRepo: ITeamRepo, userRepo: IUserRepo): ITeamSvc => {
    const getTable = async (pagination: PaginationFilter) => {
        const { filter, page = 0, sort, limit = 0 } = pagination

        const data = await teamRepo
            .find(filter, pagination.projection)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()

        const total = await teamRepo.countDocuments(filter)

        return {
            data,
            total,
        }
    }

    const getAutocomplete = async (info: AutocompleteFilter) => {
        const { filter, search, limit = 0 } = info

        const autoFilter = {
            ...filter,
            name: {
                $regex: search || '',
                $options: 'ig',
            },
        }

        const data = await teamRepo.find(autoFilter).limit(limit).lean()

        return {
            data,
        }
    }

    const getById = async (id: string) => {
        const team = await teamRepo.findById(id).lean()

        if (!team) {
            throw new Error('Could not find Team')
        }

        return team
    }

    const update = async (teamId: string, data: Partial<Team>) => {
        const currentTeam = await teamRepo.findById(teamId).lean()

        if (!currentTeam) {
            throw new Error('Could not find Team')
        }

        const fullData = {
            ...currentTeam,
            ...data,
        }

        await teamRepo.validate(fullData)

        const team = await teamRepo.findByIdAndUpdate(
            teamId,
            { $set: fullData },
            { new: true }
        )

        if (!team) throw new Error(`Team ${teamId} does not exist!`)

        return team.toObject()
    }

    const create = async (data: Team) => {
        const team = await teamRepo.create(data)

        if (!team) throw new Error(`Could not create Team`)

        return team.toObject()
    }

    const deleteOne = async (teamId: string) => {
        const currentTeam = await teamRepo.findById(teamId).lean()

        if (!currentTeam) {
            throw new Error('Could not find Team')
        }

        await teamRepo.findByIdAndDelete(teamId)
    }

    const assignMember = async (userId: string, teamId: string) => {
        const currentTeam = await teamRepo.findById(teamId).lean()

        if (!currentTeam) {
            throw new Error('Could not find Team')
        }

        const user = await userRepo.findByIdAndUpdate(
            userId,
            {
                $addToSet: {
                    roleNames: currentTeam.roleNames || [],
                },
            },
            { new: true }
        )

        if (!user) {
            throw new Error('Could not get new user')
        }

        const updatedTeam = await teamRepo.findByIdAndUpdate(
            teamId,
            {
                $push: {
                    memberIds: userId,
                },
            },
            { new: true }
        )

        if (!updatedTeam) {
            throw new Error('Could not get new team')
        }

        return updatedTeam
    }

    const unassignMember = async (userId: string, teamId: string) => {
        const currentTeam = await teamRepo.findById(teamId).lean()

        if (!currentTeam) {
            throw new Error('Could not find Team')
        }

        const user = await userRepo.findByIdAndUpdate(
            userId,
            {
                $pull: {
                    roleNames: currentTeam.roleNames || [],
                },
            },
            { new: true }
        )

        if (!user) {
            throw new Error('Could not get new user')
        }

        const updatedTeam = await teamRepo.findByIdAndUpdate(
            teamId,
            {
                $pull: {
                    memberIds: userId,
                },
            },
            { new: true }
        )

        if (!updatedTeam) {
            throw new Error('Could not get new team')
        }

        return updatedTeam
    }

    return {
        deleteOne,
        getTable,
        getAutocomplete,
        getById,
        update,
        create,
        assignMember,
        unassignMember,
    }
}
