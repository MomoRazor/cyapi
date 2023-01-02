import mongoose from 'mongoose'
import { MONGO_URL, PORT } from './env'
import { TeamRepo, CommunityRepo, UserRepo } from './data'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { CommunitySvc, TeamSvc, UserSvc } from './svc'
import { AuthApi, CommunityApi, TeamApi, UserApi } from './api'

const main = async () => {
    // Init database
    const databaseConnection = mongoose.createConnection(MONGO_URL)
    console.info(`Connected to Mongo!`)

    // Init Repository
    const userRepo = await UserRepo(databaseConnection)
    const teamRepo = await TeamRepo(databaseConnection)
    const communityRepo = await CommunityRepo(databaseConnection)

    // Init Service
    const userSvc = UserSvc(userRepo)
    const teamSvc = TeamSvc(teamRepo)
    const communitySvc = CommunitySvc(communityRepo)

    const prefix = '/cam'

    // Init web server
    const app = express()
    app.use(cors())
    app.use(helmet())

    // Init Routes
    AuthApi(app)
    CommunityApi(app, communitySvc, prefix)
    TeamApi(app, teamSvc, prefix)
    UserApi(app, userSvc, prefix)

    // Start application
    app.listen(PORT, () => {
        console.log(`CAM Youths API Initialised!`)
        console.log(`========================`)
    })
}

main()
