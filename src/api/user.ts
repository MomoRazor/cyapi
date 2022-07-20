import { Application } from 'express'

export const userRoutes = (app: Application, serviceMap: any) => {
    app.get(`/:collection/:uid`, async (req, res, next) => {
        try {
            const { collection, uid } = req.params

            let data: any = undefined

            if (!serviceMap[collection]) return res.status(404).json()

            data = await serviceMap[collection].getByUid(uid)

            if (data) return res.status(200).json(data)

            return next()
        } catch (e) {
            return next()
        }
    })
}
