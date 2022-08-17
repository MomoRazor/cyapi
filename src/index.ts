import { MONGO_URL, FIREBASE_SERVICE_ACCOUNT } from './env'
import { connect } from 'mongoose'
import admin from 'firebase-admin'
import { UserService } from './services'
import { startApp } from './api'

const setup = async () => {
    const userService = UserService()

    try {
        await userService.upsert({
            displayName: 'Maurovic Cachia',
            email: `maurovic.cachia@gmail.com`,
            password: '000000',
            isAdmin: true,
        })
    } catch (e) {
        console.warn(e)
    }
}

const main = async () => {
    admin.initializeApp({
        credential: admin.credential.cert(FIREBASE_SERVICE_ACCOUNT),
    })
    console.log(`Connected to Firebase!`)

    await connect(MONGO_URL)
    console.log(`Connected to Mongo!`)

    await setup()
    console.log(`Initialised data!`)

    await startApp()
}

main()
