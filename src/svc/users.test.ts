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
                $in: ["63b1ec93614ccbd7249986d4","63c42e7672113ffd8916e5af","63c4317372113ffd8916e5b4"]
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