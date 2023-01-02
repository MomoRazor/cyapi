import { Application } from 'express'
import { IUserSvc } from '../svc'

export const UserApi = (
    app: Application,
    userService: IUserSvc,
    prefix: string
) => {
    app.post(`${prefix}/login`, async (req, res) => {
        try {
            const { uid } = req.body

            if (!uid) {
                return res.status(400).json({
                    data: null,
                    errors: ['Missing Uid!'],
                })
            }

            const user = await userService.getByUid(uid)

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

    app.post(`${prefix}/get/users`, async (req, res) => {
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

    app.post(`${prefix}/get/users/table`, async (req, res) => {
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

    app.post(`${prefix}/get/users/autocomplete`, async (req, res) => {
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
}
