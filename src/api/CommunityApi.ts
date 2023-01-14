import { Application } from 'express'
import { ICommunitySvc } from '../svc'

export const CommunityApi = (
    app: Application,
    communityService: ICommunitySvc,
    prefix: string = ''
) => {
    app.post(`${prefix}/create/communities`, async (req, res) => {
        try {
            const body = req.body

            const newCommunity = await communityService.create(body)

            return res.status(200).json({
                data: newCommunity,
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

    app.post(`${prefix}/update/communities`, async (req, res) => {
        try {
            const { id, ...body } = req.body

            if (!id) {
                return res.status(400).json({
                    data: null,
                    errors: ['Missing Id'],
                })
            }

            const newCommunity = await communityService.update(id, body)

            return res.status(200).json({
                data: newCommunity,
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

    app.post(`${prefix}/get/communities`, async (req, res) => {
        try {
            const { id } = req.body

            if (!id) {
                return res.status(400).json({
                    data: null,
                    errors: ['Missing Id!'],
                })
            }

            const community = await communityService.getById(id)

            return res.status(200).json({
                data: community,
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

    app.post(`${prefix}/get/communities/table`, async (req, res) => {
        try {
            const body = req.body

            const communityTable = await communityService.getTable(body)

            return res.status(200).json({
                data: communityTable,
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

    app.post(`${prefix}/get/communities/autocomplete`, async (req, res) => {
        try {
            const body = req.body

            const communityTable = await communityService.getAutocomplete(body)

            return res.status(200).json({
                data: communityTable,
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

    app.post(`${prefix}/delete/communities`, async (req, res) => {
        try {
            const { id } = req.body

            if (!id) {
                return res.status(400).json({
                    data: null,
                    errors: ['Missing Id!'],
                })
            }

            const community = await communityService.deleteOne(id)

            return res.status(200).json({
                data: community,
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
