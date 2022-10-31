import { Application } from 'express'

export const HealthApi = (app: Application) => {
	app.post(`/health`, async (_, res) => {
		return res.status(200).json({
			message: 'I live!',
		})
	})
}
