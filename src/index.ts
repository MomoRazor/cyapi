import mongoose from 'mongoose'
import { FIREBASE_SERVICE_ACCOUNT, MONGO_URL, PORT } from './env'
import admin from 'firebase-admin'
import { startApp } from './util'
import { UserRepo } from './data/UserRepo'
import { TeamRepo } from './data/TeamRepo'
import { CommunityRepo } from './data/CommunityRepo'
import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import { EventRepo } from './data/EventRepo'

const main = async () => {
    // Init database
    const databaseConnection = mongoose.createConnection(MONGO_URL)
    console.info(`Connected to Mongo!`)

    // Init firebase auth
    admin.initializeApp({
        credential: admin.credential.cert(FIREBASE_SERVICE_ACCOUNT),
    })
    console.info(`Connected to Firebase!`)

    // Init Repository
    const userRepo = await UserRepo(databaseConnection)
    const teamRepo = await TeamRepo(databaseConnection)
    const communityRepo = await CommunityRepo(databaseConnection)
    const eventRepo = await EventRepo(databaseConnection)

    // Init Service

    // Init Data
    await startApp(userRepo)
    console.info(`Initialised data!`)

    // Init web server
    const app = express()
    app.use(express.json({ limit: '1mb' }))
    app.use(cors())
    app.use(morgan('dev'))

    // Init Routes

    // Start application
    app.listen(PORT, () => {
        console.log(`CY API Initialised!`)
        console.log(`========================`)
    })
}

main()
