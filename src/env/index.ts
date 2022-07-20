import { ServiceAccount } from 'firebase-admin'
import { config } from 'dotenv'
config()

if (!process.env.PORT) throw new Error(`PORT environment variable is required!`)

export const PORT = process.env.PORT

if (!process.env.MONGO_URL)
    throw new Error(`MONGO_URL environment variable is required!`)

export const MONGO_URL = process.env.MONGO_URL

if (!process.env.FIREBASE_CLIENT_EMAIL)
    throw new Error(`FIREBASE_CLIENT_EMAIL environment variable is required!`)
if (!process.env.FIREBASE_PRIVATE_KEY)
    throw new Error(`FIREBASE_PRIVATE_KEY environment variable is required!`)
if (!process.env.FIREBASE_PROJECT_ID)
    throw new Error(`FIREBASE_PROJECT_ID environment variable is required!`)

export const FIREBASE_SERVICE_ACCOUNT: ServiceAccount = {
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/gm, '\n'),
    projectId: process.env.FIREBASE_PROJECT_ID,
}

if (!process.env.DEVELOPMENT)
    console.log('DEVELOPMENT env variable not set, assuming true')

export const DEVELOPMENT = process.env.DEVELOPMENT || true
