import mongoose, { PipelineStage } from 'mongoose';
import { AutocompleteFilter, IUserRepo, PaginationFilter, User } from '../data'
import { aggregationPagination } from '../util';

export interface IUserSvc {
    getTable: (
        pagination: PaginationFilter
    ) => Promise<{ data: User[]; total: number }>
    getAutocomplete: (info: AutocompleteFilter) => Promise<{ data: User[] }>
    getById: (userId: string) => Promise<User>
    getByUid: (userId: string) => Promise<User>
}

export const UserSvc = (userRepo: IUserRepo): IUserSvc => {
    const getTable = async (pagination: PaginationFilter) => {
        let aggregation: PipelineStage[] = [
            {
                $lookup: {       
                    from: 'teams',
                    localField: '_id',
                    foreignField: 'memberIds',
                    as: 'teamMemberOf'
                }
            },
            {
                $lookup: {       
                    from: 'communities',
                    localField: '_id',
                    foreignField: 'memberIds',
                    as: 'communityMemberOf'
                }
            },
            {
                $lookup: {       
                    from: 'communities',
                    localField: '_id',
                    foreignField: 'guideIds',
                    as: 'communityGuideOf'
                }
            }
        ]

        aggregation = aggregation.concat(aggregationPagination(pagination, ['_id']))

        const data = await userRepo.aggregate(aggregation)

        return {
            data,
            total: data[0]?.totalCount || 0,
        }
    }

    const getAutocomplete = async (info: AutocompleteFilter) => {
        const { filter, search, limit } = info

        const autoFilter = {
            ...filter,
            name: search ? {
                $regex: search,
                $options: 'ig',
            } : undefined,
        }

        let aggregation: PipelineStage[] = [
            {
                $lookup: {       
                    from: 'teams',
                    localField: '_id',
                    foreignField: 'memberIds',
                    as: 'teamMemberOf'
                }
            },
            {
                $lookup: {       
                    from: 'communities',
                    localField: '_id',
                    foreignField: 'memberIds',
                    as: 'communityMemberOf'
                }
            },
            {
                $lookup: {       
                    from: 'communities',
                    localField: '_id',
                    foreignField: 'guideIds',
                    as: 'communityGuideOf'
                }
            }
        ]

        aggregation = aggregation.concat(aggregationPagination({
            filter: autoFilter,
            limit
        }, ['_id']))

        const data = await userRepo.aggregate(aggregation)

        return {
            data,
        }
    }

    const getById = async (id: string) => {
        let aggregation: PipelineStage[] = [
            {
                $lookup: {       
                    from: 'teams',
                    localField: '_id',
                    foreignField: 'memberIds',
                    as: 'teamMemberOf'
                }
            },
            {
                $lookup: {       
                    from: 'communities',
                    localField: '_id',
                    foreignField: 'memberIds',
                    as: 'communityMemberOf'
                }
            },
            {
                $lookup: {       
                    from: 'communities',
                    localField: '_id',
                    foreignField: 'guideIds',
                    as: 'communityGuideOf'
                }
            },
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(
                        id
                    )
                }
            }
        ]

        const users = await userRepo.aggregate(aggregation)

        if (!users) {
            throw new Error('Could not find User')
        }

        return users[0]
    }

    const getByUid = async (uid: string) => {
        let aggregation: PipelineStage[] = [
            {
                $lookup: {       
                    from: 'teams',
                    localField: '_id',
                    foreignField: 'memberIds',
                    as: 'teamMemberOf'
                }
            },
            {
                $lookup: {       
                    from: 'communities',
                    localField: '_id',
                    foreignField: 'memberIds',
                    as: 'communityMemberOf'
                }
            },
            {
                $lookup: {       
                    from: 'communities',
                    localField: '_id',
                    foreignField: 'guideIds',
                    as: 'communityGuideOf'
                }
            },
            {
                $match: {
                    uid
                }
            }
        ]

        const users = await userRepo.aggregate(aggregation)

        if (!users) {
            throw new Error('Could not find User')
        }

        return users[0]
    }

    return {
        getTable,
        getAutocomplete,
        getById,
        getByUid
    }
}
