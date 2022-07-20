import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { PORT } from '../env'
import { UserService } from '../services'
import { userRoutes } from './user'
import { crudRoutes } from './crud'

export const startApp = async () => {
    const app = express()

    app.use(express.json({ limit: `2mb` }))
    app.use(cors())
    app.use(morgan(`dev`))

    const userService = UserService()

    const serviceMap: { [collection: string]: any } = {
        users: userService,
    }

    userRoutes(app, serviceMap)

    crudRoutes(app, serviceMap)

    app.listen({ port: PORT }, () =>
        console.log(`🚀 Server ready at http://localhost:${PORT}`)
    )
}
