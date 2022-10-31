import { Application } from 'express'

export const TeamApi = (app: Application, teamService: ITeamService) => {
    app.post(`/create/team`, async (req, res) => {
        try {
            const body = req.body

            const newTeam = await teamService.create(body)

            return res.status(200).json(newTeam)
        } catch (e: any) {
            console.error(e)
            return res.status(500).json({
                status: 500,
                message: e.message,
            })
        }
    })

    app.post(`/update/team`, async (req, res) => {
        try {
            const { id, ...body } = req.body

            if (!id) {
                return res.status(400).json({
                    status: 400,
                    message: 'Missing Id',
                })
            }

            const newTeam = await teamService.update(id, body)

            return res.status(200).json(newTeam)
        } catch (e: any) {
            console.error(e)
            return res.status(500).json({
                status: 500,
                message: e.message,
            })
        }
    })

    app.post(`/get/team`, async (req, res) => {
        try {
            const { id } = req.body

            if (!id) {
                return res.status(400).json({
                    status: 400,
                    message: 'Missing Id',
                })
            }

            const team = await teamService.getById(id)

            return res.status(200).json(team)
        } catch (e: any) {
            console.error(e)
            return res.status(500).json({
                status: 500,
                message: e.message,
            })
        }
    })

    app.post(`/get/team/table`, async (req, res) => {
        try {
            const body = req.body

            const teams = await teamService.getTable(body)

            return res.status(200).json(teams)
        } catch (e: any) {
            console.error(e)
            return res.status(500).json({
                status: 500,
                message: e.message,
            })
        }
    })

    app.post(`/get/team/members/table`, async (req, res) => {
        try {
            const { teamId } = req.body

            const { limit, page, sort, search } = req.query

            let data: any = undefined

            data = await teamService.getMembersTable(
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

    app.post(`/get/team/autocomplete`, async (req, res) => {
        try {
            const body = req.body

            const teams = await teamService.getAutocomplete(body)

            return res.status(200).json(teams)
        } catch (e: any) {
            console.error(e)
            return res.status(500).json({
                status: 500,
                message: e.message,
            })
        }
    })

    app.post(`/get/team/members/autocomplete`, async (req, res) => {
        try {
            const { teamId } = req.body

            const { limit, page, sort, search } = req.query

            let data: any = undefined

            data = await teamService.getMembersAutocomplete(
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

    app.post(`/delete/team`, async (req, res) => {
        try {
            const { id } = req.body

            if (!id) {
                return res.status(400).json({
                    status: 400,
                    message: 'Missing Id',
                })
            }

            const team = await teamService.deleteOne(id)

            return res.status(200).json(team)
        } catch (e: any) {
            console.error(e)
            return res.status(500).json({
                status: 500,
                message: e.message,
            })
        }
    })

    app.post(`/assign/to/team`, async (req, res, next) => {
        try {
            const { userId, teamId } = req.body

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

    app.post(`/unassign/from/team`, async (req, res, next) => {
        try {
            const { userId, teamId } = req.body

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
