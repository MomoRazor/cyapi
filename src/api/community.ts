import { Application } from 'express'
import { CommunityService } from '../services'

export const communityRoutes = (app: Application) => {
    const communtiyService = CommunityService()

    app.post(
        `/assign/:userId/community/:communityId/member`,
        async (req, res, next) => {
            try {
                const { userId, communityId } = req.params

                let data: any = undefined

                data = await communtiyService.assignMember(userId, communityId)

                if (data) return res.status(200).json(data)

                return next()
            } catch (e: any) {
                console.error(e)
                return res.status(500).json({
                    message: e.message,
                })
            }
        }
    )

    app.post(
        `/unassign/:userId/community/:communityId/member`,
        async (req, res, next) => {
            try {
                const { userId, communityId } = req.params

                let data: any = undefined

                data = await communtiyService.unassignMember(
                    userId,
                    communityId
                )

                if (data) return res.status(200).json(data)

                return next()
            } catch (e: any) {
                console.error(e)
                return res.status(500).json({
                    message: e.message,
                })
            }
        }
    )

    app.post(
        `/assign/:userId/community/:communityId/guide`,
        async (req, res, next) => {
            try {
                const { userId, communityId } = req.params

                let data: any = undefined

                data = await communtiyService.assignGuide(userId, communityId)

                if (data) return res.status(200).json(data)

                return next()
            } catch (e: any) {
                console.error(e)
                return res.status(500).json({
                    message: e.message,
                })
            }
        }
    )

    app.post(
        `/unassign/:userId/community/:communityId/guide`,
        async (req, res, next) => {
            try {
                const { userId, communityId } = req.params

                let data: any = undefined

                data = await communtiyService.unassignGuide(userId, communityId)

                if (data) return res.status(200).json(data)

                return next()
            } catch (e: any) {
                console.error(e)
                return res.status(500).json({
                    message: e.message,
                })
            }
        }
    )
}
