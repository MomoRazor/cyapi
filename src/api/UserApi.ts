import { Application } from 'express'

export const UserApi = (app: Application, userService: IUserService) => {
    app.post(`/get/users/uid`, async (req, res, next) => {
        try {
            const { uid } = req.body

            let data: any = undefined

            data = await userService.getUserByUid(uid)

            if (data) return res.status(200).json(data)

            return next()
        } catch (e) {
            return next()
        }
    })

    app.post(`/get/user`, async (req, res) => {
        try {
            const { id } = req.body

            if (!id) {
                return res.status(400).json({
                    data: null,
                    errors: ['Missing Id!'],
                })
            }

            const user = await userService.getById(id)

            return res.status(200).json({
                data: user,
                errors: [],
            })
        } catch (e: any) {
            console.error(e)
            return res.status(500).json({
                data: null,
                errors: [e.message],
            })
        }
    })

    app.post(`/get/user/table`, async (req, res) => {
        try {
            const body = req.body

            const userTable = await userService.getTable(body)

            return res.status(200).json({
                data: userTable,
                errors: [],
            })
        } catch (e: any) {
            console.error(e)
            return res.status(500).json({
                data: null,
                errors: [e.message],
            })
        }
    })

    app.post(`/get/user/autocomplete`, async (req, res) => {
        try {
            const body = req.body

            const userTable = await userService.getAutocomplete(body)

            return res.status(200).json({
                data: userTable,
                errors: [],
            })
        } catch (e: any) {
            console.error(e)
            return res.status(500).json({
                data: null,
                errors: [e.message],
            })
        }
    })

    app.post(`/set/admin`, async (req, res, next) => {
        try {
            const { id } = req.body

            let data: any = undefined

            data = await userService.upsert({
                _id: id,
                isAdmin: true,
            })

            if (data) return res.status(200).json(data)

            return next()
        } catch (e: any) {
            console.error(e)
            return res.status(500).json({
                message: e.message,
            })
        }
    })

    app.post(`/unset/admin`, async (req, res, next) => {
        try {
            const { id } = req.body

            let data: any = undefined

            data = await userService.upsert({
                _id: id,
                isAdmin: false,
            })

            if (data) return res.status(200).json(data)

            return next()
        } catch (e: any) {
            console.error(e)
            return res.status(500).json({
                message: e.message,
            })
        }
    })
}
