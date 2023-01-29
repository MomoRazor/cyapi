import mongoose from 'mongoose'
import { MONGO_URL } from '../env'
import {TeamRepo,} from '../data'
import {TeamSvc} from '.'

test('Unassign User', async () => {
    // Init database
    const databaseConnection = mongoose.createConnection(MONGO_URL)
    const teamRepo = await TeamRepo(databaseConnection)
    
    const teamSvc = TeamSvc(teamRepo)
    const data = await teamSvc.unassignMember('63b1ec93614ccbd7249986d4', '63b33cdd5cce10fe69d65f2f')
    console.log(data)
})