import { Application } from 'express'

export const EventApi = (app: Application, eventService: IEventService) => {
    app.post(`/create/event`, async (req, res) => {
        try {
            const body = req.body

            const newEvent = await eventService.create(body)

            return res.status(200).json(newEvent)
        } catch (e: any) {
            console.error(e)
            return res.status(500).json({
                status: 500,
                message: e.message,
            })
        }
    })

    app.post(`/update/event`, async (req, res) => {
        try {
            const { id, ...body } = req.body

            if (!id) {
                return res.status(400).json({
                    status: 400,
                    message: 'Missing Id',
                })
            }

            const newEvent = await eventService.update(id, body)

            return res.status(200).json(newEvent)
        } catch (e: any) {
            console.error(e)
            return res.status(500).json({
                status: 500,
                message: e.message,
            })
        }
    })

    app.post(`/get/event`, async (req, res) => {
        try {
            const { id } = req.body

            if (!id) {
                return res.status(400).json({
                    status: 400,
                    message: 'Missing Id',
                })
            }

            const event = await eventService.getById(id)

            return res.status(200).json(event)
        } catch (e: any) {
            console.error(e)
            return res.status(500).json({
                status: 500,
                message: e.message,
            })
        }
    })

    app.post(`/get/event/calendar`, async (req, res) => {
        try {
            const { from, to } = req.body

            const events = await eventService.getCalendar(from, to)

            return res.status(200).json(events)
        } catch (e: any) {
            console.error(e)
            return res.status(500).json({
                status: 500,
                message: e.message,
            })
        }
    })

    app.post(`/delete/eveent`, async (req, res) => {
        try {
            const { id } = req.body

            if (!id) {
                return res.status(400).json({
                    status: 400,
                    message: 'Missing Id',
                })
            }

            const event = await eventService.deleteOne(id)

            return res.status(200).json(event)
        } catch (e: any) {
            console.error(e)
            return res.status(500).json({
                status: 500,
                message: e.message,
            })
        }
    })
}
