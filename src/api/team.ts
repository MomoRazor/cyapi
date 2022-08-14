import { Application } from 'express'
import { TeamService } from '../services'

export const teamRoutes = (app: Application) => {
    const teamService = TeamService()

    app.post(`/assign/:userId/team/:teamId`, async (req, res, next) => {
        try {
            const { userId, teamId } = req.params

            let data: any = undefined

            data = await teamService.assignMember(userId, teamId)

            if (data) return res.status(200).json(data)

            return next()
        } catch (e: any) {
            console.error(e)
            return res.status(500).json({
                message: e.message,
            })
        }
    })

    app.post(`/unassign/:userId/team/:teamId`, async (req, res, next) => {
        try {
            const { userId, teamId } = req.params

            let data: any = undefined

            data = await teamService.unassignMember(userId, teamId)

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
