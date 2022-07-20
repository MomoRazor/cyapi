import { FilterQuery, Model } from 'mongoose'

export const BaseService = <T>(repo: Model<any>) => {
    const getMany = async ({
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
        filter?: FilterQuery<T>
    }) => {
        page = page < 1 ? 1 : page
        limit = limit < 0 ? 0 : limit

        const query: any = { ...filter, deleted: false }

        const searchQuery: any[] = []
        for (const element of search) {
            const [key, value] = element.split(`:`)
            if (!key || !value) continue
            searchQuery.push({ [key]: { $regex: `${value}`, $options: `i` } })
        }
        if (searchQuery.length > 0) query[`$or`] = searchQuery

        const data = await repo
            .find(query)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit)

        const count = await repo.countDocuments(query)

        return {
            data: data.map((datum: any) => datum.toObject()),
            count,
            page,
            limit,
        }
    }

    const getById = async (_id: string) => {
        return (await repo.findOne({ _id, deleted: false }))?.toObject()
    }

    const upsert = async (data: Partial<T & { _id?: string }>) => {
        if (data?._id) {
            const document = await repo.findOneAndUpdate(
                { _id: data._id },
                {
                    $set: data,
                },
                { new: true }
            )

            return document
        }
        const document = await repo.create(data)
        return document
    }

    const deleteById = async (_id: string) => {
        const document = await repo.findByIdAndUpdate(
            _id,
            { $set: { deleted: true } },
            { new: true }
        )
        return document?.toObject()
    }

    return {
        getMany,
        getById,
        upsert,
        deleteById,
    }
}
