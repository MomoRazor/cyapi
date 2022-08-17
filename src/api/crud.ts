import { Application } from 'express'

export const crudRoutes = (app: Application, serviceMap: any) => {
    app.get(`/:collection`, async (req, res) => {
        try {
            const { collection } = req.params

            const { limit, page, sort, search, userSearch } = req.query

            let data: any = undefined

            if (!serviceMap[collection]) return res.status(404).json()

            data = await serviceMap[collection].getMany({
                limit: parseInt(limit?.toString() || `10`),
                page: parseInt(page?.toString() || `1`),
                sort: sort?.toString(),
                search,
                userSearch,
            })

            return res.status(200).json(data)
        } catch (e: any) {
            console.error(e)
            return res.status(500).json({
                message: e.message,
            })
        }
    })

    app.get(`/:collection/:id`, async (req, res) => {
        try {
            const { collection, id } = req.params

            let data: any = undefined

            if (!serviceMap[collection]) return res.status(404).json()

            data = await serviceMap[collection].getById(id)

            return res.status(200).json(data)
        } catch (e: any) {
            console.error(e)
            return res.status(500).json({
                message: e.message,
            })
        }
    })

    app.post(`/:collection/:id`, async (req, res) => {
        try {
            const { collection, id } = req.params
            const { body } = req

            let data: any = undefined

            if (!serviceMap[collection]) return res.status(404).json()

            data = await serviceMap[collection].upsert(
                {
                    _id: id,
                    ...body,
                },
                res
            )

            return res.status(200).json(data)
        } catch (e: any) {
            console.error(e)
            return res.status(500).json({
                message: e.message,
            })
        }
    })

    app.post(`/:collection`, async (req, res) => {
        try {
            const { collection } = req.params
            const { body } = req

            let data: any = undefined

            if (!serviceMap[collection]) return res.status(404).json()

            data = await serviceMap[collection].upsert(body, res)

            return res.status(200).json(data)
        } catch (e: any) {
            console.error(e)
            return res.status(500).json({
                message: e.message,
            })
        }
    })

    app.delete(`/:collection/:id`, async (req, res) => {
        try {
            const { collection, id } = req.params

            let data: any = undefined

            if (!serviceMap[collection]) return res.status(404).json()

            data = await serviceMap[collection].deleteById(id)

            return res.status(200).json(data)
        } catch (e: any) {
            console.error(e)
            return res.status(500).json({
                message: e.message,
            })
        }
    })
}
