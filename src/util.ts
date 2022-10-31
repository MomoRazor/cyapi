import { PipelineStage } from 'mongoose'
import { PaginationFilter } from './data/general'
import { IUserRepo } from './data/UserRepo'

export const parseSortString = (stringSort: string): any => {
    if (stringSort[0] === '-') {
        return {
            [stringSort.substring(1, stringSort.length - 1)]: -1,
        }
    } else {
        return {
            [stringSort]: 1,
        }
    }
}

export const parseProjectionString = (stringProjection: string): any => {
    const list = stringProjection.split(' ')

    const projection: { [key: string]: number } = {}
    for (let i = 0; i < list.length; i++) {
        if (list[i][0] === '-') {
            projection[list[i].substring(1, list[i].length - 1)] = -1
        } else {
            projection[list[i]] = 1
        }
    }

    return projection
}

export const aggregationPagination = (
    pagination: PaginationFilter,
    projection?: string
) => {
    const { filter, page, limit, sort } = pagination

    let aggregationPagination: PipelineStage[] = []

    if (filter && Object.keys(filter).length > 0) {
        aggregationPagination.push({
            $match: filter,
        })
    }

    if (sort) {
        aggregationPagination.push({
            $sort: parseSortString(sort),
        })
    }

    aggregationPagination = aggregationPagination.concat([
        {
            $facet: {
                totalCount: [{ $count: 'value' }],
                pipelineResults: projection
                    ? [
                          {
                              $project: parseProjectionString(projection),
                          },
                      ]
                    : [],
            },
        },
        {
            $unwind: {
                path: '$pipelineResults',
            },
        },
        {
            $unwind: {
                path: '$totalCount',
            },
        },
        {
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: [
                        '$pipelineResults',
                        { totalCount: '$totalCount.value' },
                    ],
                },
            },
        },
    ])

    if (page - 1 > 0) {
        aggregationPagination.push({
            $skip: (page - 1) * limit,
        })
    }

    if (limit > 0) {
        aggregationPagination.push({
            $limit: limit,
        })
    }

    return aggregationPagination
}

export const checkProjection = (entity: string, stringProjection: string) => {
    const list = stringProjection.split(' ')

    return (
        list.length === 0 ||
        list.some((project) => project.includes(entity + '.'))
    )
}

export const startApp = async (userRepo: IUserRepo) => {
    try {
        await userRepo.create({
            displayName: 'Maurovic Cachia',
            email: `maurovic.cachia@gmail.com`,
            password: '000000',
            isAdmin: true,
        })
    } catch (e) {
        console.warn(e)
    }
}
