import { Application } from 'express'
import { ICommunitySvc } from '../services'

export const CommunityApi = (
    app: Application,
    communityService: ICommunitySvc
) => {
    app.post(`/create/community`, async (req, res) => {
        try {
            const body = req.body

            const newCommunity = await communityService.create(body)

            return res.status(200).json(newCommunity)
        } catch (e: any) {
            console.error(e)
            return res.status(500).json({
                status: 500,
                message: e.message,
            })
        }
    })

    app.post(`/update/community`, async (req, res) => {
        try {
            const { id, ...body } = req.body

            if (!id) {
                return res.status(400).json({
                    status: 400,
                    message: 'Missing Id',
                })
            }

            const newCommunity = await communityService.update(id, body)

            return res.status(200).json(newCommunity)
        } catch (e: any) {
            console.error(e)
            return res.status(500).json({
                status: 500,
                message: e.message,
            })
        }
    })

    app.post(`/get/community`, async (req, res) => {
        try {
            const { id } = req.body

            if (!id) {
                return res.status(400).json({
                    status: 400,
                    message: 'Missing Id',
                })
            }

            const community = await communityService.getById(id)

            return res.status(200).json(community)
        } catch (e: any) {
            console.error(e)
            return res.status(500).json({
                status: 500,
                message: e.message,
            })
        }
    })

    app.post(`/get/community/table`, async (req, res) => {
        try {
            const body = req.body

            const communities = await communityService.getTable(body)

            return res.status(200).json(communities)
        } catch (e: any) {
            console.error(e)
            return res.status(500).json({
                status: 500,
                message: e.message,
            })
        }
    })

    app.post(`/get/community/members/table`, async (req, res) => {
        try {
            const { communityId } = req.body

            const { limit, page, sort, search } = req.query

            let data: any = undefined

            data = await communityService.getMembersTable(
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

    app.post(`/get/community/guides/table`, async (req, res) => {
        try {
            const { communityId } = req.body

            const { limit, page, sort, search } = req.query

            let data: any = undefined

            data = await communityService.getGuidesTable(
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

    app.post(`/get/community/autocomplete`, async (req, res) => {
        try {
            const body = req.body

            const communities = await communityService.getAutocomplete(body)

            return res.status(200).json(communities)
        } catch (e: any) {
            console.error(e)
            return res.status(500).json({
                status: 500,
                message: e.message,
            })
        }
    })

    app.post(`/get/community/members/autocomplete`, async (req, res) => {
        try {
            const { communityId } = req.body

            const { limit, page, sort, search } = req.query

            let data: any = undefined

            data = await communityService.getMembersAutocomplete(
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

    app.post(`/get/community/guides/autocomplete`, async (req, res) => {
        try {
            const { communityId } = req.body

            const { limit, page, sort, search } = req.query

            let data: any = undefined

            data = await communityService.getGuidesAutocomplete(
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

    app.post(`/delete/community`, async (req, res) => {
        try {
            const { id } = req.body

            if (!id) {
                return res.status(400).json({
                    status: 400,
                    message: 'Missing Id',
                })
            }

            const community = await communityService.deleteOne(id)

            return res.status(200).json(community)
        } catch (e: any) {
            console.error(e)
            return res.status(500).json({
                status: 500,
                message: e.message,
            })
        }
    })

    app.post(`/assign/member/to/community`, async (req, res, next) => {
        try {
            const { userId, communityId } = req.body

            let data: any = undefined

            data = await communityService.assignMember(userId, communityId)

            if (data) return res.status(200).json(data)

            return next()
        } catch (e: any) {
            console.error(e)
            return res.status(500).json({
                message: e.message,
            })
        }
    })

    app.post(`/unassign/member/from/community`, async (req, res, next) => {
        try {
            const { userId, communityId } = req.body

            let data: any = undefined

            data = await communityService.unassignMember(userId, communityId)

            if (data) return res.status(200).json(data)

            return next()
        } catch (e: any) {
            console.error(e)
            return res.status(500).json({
                message: e.message,
            })
        }
    })

    app.post(`/assign/guide/to/community`, async (req, res, next) => {
        try {
            const { userId, communityId } = req.body

            let data: any = undefined

            data = await communityService.assignGuide(userId, communityId)

            if (data) return res.status(200).json(data)

            return next()
        } catch (e: any) {
            console.error(e)
            return res.status(500).json({
                message: e.message,
            })
        }
    })

    app.post(`/unassign/guide/from/community`, async (req, res, next) => {
        try {
            const { userId, communityId } = req.body

            let data: any = undefined

            data = await communityService.unassignGuide(userId, communityId)

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
