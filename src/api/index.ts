import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { PORT } from '../env'
import { CommunityService, TeamService, UserService } from '../services'
import { userRoutes } from './user'
import { crudRoutes } from './crud'
import { authenticationRoutes } from './authentication'
import { teamRoutes } from './team'
import { communityRoutes } from './community'

export const startApp = async () => {
    const app = express()

    app.use(express.json({ limit: `2mb` }))
    app.use(cors())
    app.use(morgan(`dev`))

    const userService = UserService()
    const teamService = TeamService()
    const communityService = CommunityService()

    const serviceMap: { [collection: string]: any } = {
        users: userService,
        teams: teamService,
        communities: communityService,
    }

    authenticationRoutes(app)

    userRoutes(app)
    teamRoutes(app)
    communityRoutes(app)

    crudRoutes(app, serviceMap)

    app.listen({ port: PORT }, () =>
        console.log(`🚀 Server ready at http://localhost:${PORT}`)
    )
}
