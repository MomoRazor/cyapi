import { AutocompleteFilter, PaginationFilter } from '../data/general'
import { ICommunityRepo, Community } from '../data'

export interface ICommunitySvc {
    getTable: (
        pagination: PaginationFilter
    ) => Promise<{ data: Community[]; total: number }>
    getAutocomplete: (
        info: AutocompleteFilter
    ) => Promise<{ data: Community[] }>
    getById: (communityId: string) => Promise<Community>
    update: (
        communityId: string,
        data: Partial<Community>
    ) => Promise<Community>
    create: (data: Community) => Promise<Community>
    deleteOne: (communityId: string) => Promise<void>
    assignMember: (userId: string, communityId: string) => Promise<Community>
    unassignMember: (userId: string, communityId: string) => Promise<Community>
    assignGuide: (userId: string, communityId: string) => Promise<Community>
    unassignGuide: (userId: string, communityId: string) => Promise<Community>
}

export const CommunitySvc = (communityRepo: ICommunityRepo): ICommunitySvc => {
    const getTable = async (pagination: PaginationFilter) => {
        const {filter, sort, page=0, limit=0} = pagination

        const data = await communityRepo
            .find(filter, pagination.projection)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()

        const total = await communityRepo.countDocuments(filter)

        return {
            data,
            total,
        }
    }

    const getAutocomplete = async (info: AutocompleteFilter) => {
        const { filter, search, limit=0 } = info

        const autoFilter = {
            ...filter,
            name: {
                $regex: search || '',
                $options: 'ig',
            },
        }

        const data = await communityRepo.find(autoFilter).limit(limit).lean()

        return {
            data,
        }
    }

    const getById = async (id: string) => {
        const community = await communityRepo.findById(id).lean()

        if (!community) {
            throw new Error('Could not find Community')
        }

        return community
    }

    const update = async (communityId: string, data: Partial<Community>) => {
        const currentCommunity = await communityRepo
            .findById(communityId)
            .lean()

        if (!currentCommunity) {
            throw new Error('Could not find Community')
        }

        const fullData = {
            ...currentCommunity,
            ...data,
        }

        await communityRepo.validate(fullData)

        const community = await communityRepo.findByIdAndUpdate(
            communityId,
            { $set: fullData },
            { new: true }
        )

        if (!community)
            throw new Error(`Community ${communityId} does not exist!`)

        return community.toObject()
    }

    const create = async (data: Community) => {
        const community = await communityRepo.create(data)

        if (!community) throw new Error(`Could not create Community`)

        return community.toObject()
    }

    const deleteOne = async (communityId: string) => {
        const currentCommunity = await communityRepo
            .findById(communityId)
            .lean()

        if (!currentCommunity) {
            throw new Error('Could not find Community')
        }

        await communityRepo.findByIdAndDelete(communityId)
    }

    const assignMember = async (userId: string, communityId: string) => {
        const currentCommunity = await communityRepo
            .findById(communityId)
            .lean()

        if (!currentCommunity) {
            throw new Error('Could not find Community')
        }

        const updatedCommunity = await communityRepo.findByIdAndUpdate(communityId, {
            $push: {
                memberIds: userId
            }
        }, { new: true })

        if(!updatedCommunity){
            throw new Error('Could not get new community')
        }

        return updatedCommunity
    }

    const unassignMember = async (userId: string, communityId: string) => {
        const currentCommunity = await communityRepo
            .findById(communityId)
            .lean()

        if (!currentCommunity) {
            throw new Error('Could not find Community')
        }

        const updatedCommunity = await communityRepo.findByIdAndUpdate(communityId, {
            $pull: {
                memberIds: userId
            }
        }, { new: true })

        if(!updatedCommunity){
            throw new Error('Could not get new community')
        }

        return updatedCommunity
    }

    const assignGuide = async (userId: string, communityId: string) => {
        const currentCommunity = await communityRepo
            .findById(communityId)
            .lean()

        if (!currentCommunity) {
            throw new Error('Could not find Community')
        }

        const updatedCommunity = await communityRepo.findByIdAndUpdate(communityId, {
            $push: {
                guideIds: userId
            }
        }, { new: true })

        if(!updatedCommunity){
            throw new Error('Could not get new community')
        }

        return updatedCommunity
    }

    const unassignGuide = async (userId: string, communityId: string) => {
        const currentCommunity = await communityRepo
            .findById(communityId)
            .lean()

        if (!currentCommunity) {
            throw new Error('Could not find Community')
        }

        const updatedCommunity = await communityRepo.findByIdAndUpdate(communityId, {
            $pull: {
                guideIds: userId
            }
        }, { new: true })

        if(!updatedCommunity){
            throw new Error('Could not get new community')
        }

        return updatedCommunity
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
        assignGuide,
        unassignGuide,
    }
}
