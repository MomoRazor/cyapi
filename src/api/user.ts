import { Application } from 'express'
import { CommunityService, TeamService, UserService } from '../services'

export const userRoutes = (app: Application) => {
    const userService = UserService()
    const communityService = CommunityService()
    const teamService = TeamService()

    app.get(`/users/:uid`, async (req, res, next) => {
        try {
            const { uid } = req.params

            let data: any = undefined

            data = await userService.getUserByUid(uid)

            if (data) return res.status(200).json(data)

            return next()
        } catch (e) {
            return next()
        }
    })

    app.get(`/users/members/community/:communityId`, async (req, res) => {
        try {
            const { communityId } = req.params

            const { limit, page, sort, search } = req.query

            let data: any = undefined

            data = await communityService.getCommunityMembers(
                {
                    limit: parseInt(limit?.toString() || `10`),
                    page: parseInt(page?.toString() || `1`),
                    sort: sort?.toString(),
                    search: search as string[],
                },
                communityId
            )

            return res.status(200).json(data)
        } catch (e: any) {
            console.error(e)
            return res.status(500).json({
                message: e.message,
            })
        }
    })

    app.get(`/users/guides/community/:communityId`, async (req, res) => {
        try {
            const { communityId } = req.params

            const { limit, page, sort, search } = req.query

            let data: any = undefined

            data = await communityService.getCommunityGuides(
                {
                    limit: parseInt(limit?.toString() || `10`),
                    page: parseInt(page?.toString() || `1`),
                    sort: sort?.toString(),
                    search: search as string[],
                },
                communityId
            )

            return res.status(200).json(data)
        } catch (e: any) {
            console.error(e)
            return res.status(500).json({
                message: e.message,
            })
        }
    })

    app.get(`/users/members/team/:teamId`, async (req, res) => {
        try {
            const { teamId } = req.params

            const { limit, page, sort, search } = req.query

            let data: any = undefined

            data = await teamService.getTeamMembers(
                {
                    limit: parseInt(limit?.toString() || `10`),
                    page: parseInt(page?.toString() || `1`),
                    sort: sort?.toString(),
                    search: search as string[],
                },
                teamId
            )

            return res.status(200).json(data)
        } catch (e: any) {
            console.error(e)
            return res.status(500).json({
                message: e.message,
            })
        }
    })

    app.post(`/set/:id/admin`, async (req, res, next) => {
        try {
            const { id } = req.params

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

    app.post(`/unset/:id/admin`, async (req, res, next) => {
        try {
            const { id } = req.params

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
