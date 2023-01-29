import { Application } from 'express'
import { ITeamSvc } from '../svc'

export const TeamApi = (
    app: Application,
    teamService: ITeamSvc,
    prefix: string = ''
) => {
    app.post(`${prefix}/create/teams`, async (req, res) => {
        try {
            const body = req.body

            const newTeam = await teamService.create(body)

            return res.status(200).json({
                data: newTeam,
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

    app.post(`${prefix}/update/teams`, async (req, res) => {
        try {
            const { id, ...body } = req.body

            if (!id) {
                return res.status(400).json({
                    data: null,
                    errors: ['Missing Id'],
                })
            }

            const newTeam = await teamService.update(id, body)

            return res.status(200).json({
                data: newTeam,
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

    app.post(`${prefix}/get/teams`, async (req, res) => {
        try {
            const { id } = req.body

            if (!id) {
                return res.status(400).json({
                    data: null,
                    errors: ['Missing Id!'],
                })
            }

            const team = await teamService.getById(id)

            return res.status(200).json({
                data: team,
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

    app.post(`${prefix}/get/teams/table`, async (req, res) => {
        try {
            const body = req.body

            const teamTable = await teamService.getTable(body)

            return res.status(200).json({
                data: teamTable,
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

    app.post(`${prefix}/get/teams/autocomplete`, async (req, res) => {
        try {
            const body = req.body

            const teamTable = await teamService.getAutocomplete(body)

            return res.status(200).json({
                data: teamTable,
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

    app.post(`${prefix}/delete/teams`, async (req, res) => {
        try {
            const { id } = req.body

            if (!id) {
                return res.status(400).json({
                    data: null,
                    errors: ['Missing Id!'],
                })
            }

            const team = await teamService.deleteOne(id)

            return res.status(200).json({
                data: team,
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

    app.post(`${prefix}/assign/member/:userId/team/:teamId`, async (req, res) => {
        try {
            const { id } = req.body
            const { userId, teamId } = req.params

            if (!id) {
                return res.status(400).json({
                    data: null,
                    errors: ['Missing Id!'],
                })
            }

            const team = await teamService.assignMember(userId, teamId)

            return res.status(200).json({
                data: team,
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

    app.post(`${prefix}/unassign/member/:userId/team/:teamId`, async (req, res) => {
        try {
            const { id } = req.body
            const { userId, teamId } = req.params

            if (!id) {
                return res.status(400).json({
                    data: null,
                    errors: ['Missing Id!'],
                })
            }

            const team = await teamService.unassignMember(userId, teamId)

            return res.status(200).json({
                data: team,
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
