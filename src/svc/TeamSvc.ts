import { AutocompleteFilter, PaginationFilter } from '../data/general'
import { ITeamRepo, Team } from '../data'

export interface ITeamSvc {
    getTable: (
        pagination: PaginationFilter
    ) => Promise<{ data: Team[]; total: number }>
    getAutocomplete: (info: AutocompleteFilter) => Promise<{ data: Team[] }>
    getById: (teamId: string) => Promise<Team>
    update: (teamId: string, data: Partial<Team>) => Promise<Team>
    create: (data: Team) => Promise<Team>
    deleteOne: (teamId: string) => Promise<void>
}

export const TeamSvc = (teamRepo: ITeamRepo): ITeamSvc => {
    const getTable = async (pagination: PaginationFilter) => {
        const fullFilter = {
            ...pagination.filter,
        }

        const data = await teamRepo
            .find(fullFilter, pagination.projection)
            .sort(pagination.sort)
            .skip((pagination.page - 1) * pagination.limit)
            .limit(pagination.limit)
            .lean()

        const total = await teamRepo.countDocuments(fullFilter)

        return {
            data,
            total,
        }
    }

    const getAutocomplete = async (info: AutocompleteFilter) => {
        const { filter, search, limit } = info

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

    return {
        deleteOne,
        getTable,
        getAutocomplete,
        getById,
        update,
        create,
    }
}
