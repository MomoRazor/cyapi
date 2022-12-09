import { config } from 'dotenv'
config()

if (!process.env.PORT) throw new Error(`PORT environment variable is required!`)

export const PORT = process.env.PORT

if (!process.env.MONGO_URL)
    throw new Error(`MONGO_URL environment variable is required!`)

export const MONGO_URL = process.env.MONGO_URL

if (!process.env.JWT_SECRET)
    throw new Error(`Missing environment variable JWT_SECRET!`)
export const JWT_SECRET = process.env.JWT_SECRET
