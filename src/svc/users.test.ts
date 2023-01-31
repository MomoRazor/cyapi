import mongoose from 'mongoose'
import { MONGO_URL } from '../env'
import {UserRepo} from '../data'
import {UserSvc} from '../svc'

test('Testing User Aggregation', async () => {
    // Init database
    const databaseConnection = mongoose.createConnection(MONGO_URL)
    const userRepo = await UserRepo(databaseConnection)
    
    const userSvc = UserSvc(userRepo)

    await userSvc.getTable({
        filter: {
            _id: {
                $in: []
            }
        }
    })
})

// test('Testing User Aggregation', async () => {
//     // Init database
//     const databaseConnection = mongoose.createConnection(MONGO_URL)
//     const userRepo = await UserRepo(databaseConnection)
    
//     const userSvc = UserSvc(userRepo)

//     const data = await userSvc.getAutocomplete({})
//     console.log(data)
// })