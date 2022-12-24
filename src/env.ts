import { config } from 'dotenv'
config()

if (!process.env.PORT) throw new Error(`PORT environment variable is required!`)

export const PORT = process.env.PORT

if (!process.env.MONGO_URL)
    throw new Error(`MONGO_URL environment variable is required!`)

export const MONGO_URL = process.env.MONGO_URL

if (!process.env.RBAC_SECRET && !process.env.API_KEY)
    throw new Error(`Missing both RBAC_SECRET and API_KEY environment variables!`);

export const RBAC_SECRET = process.env.RBAC_SECRET;
export const API_KEY = process.env.API_KEY;
