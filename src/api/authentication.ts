import { Application } from 'express'

import admin from 'firebase-admin'
import { UserService } from '../services'

export const authenticationRoutes = (app: Application) => {
    const userService = UserService()

    app.use(async (req, res, next) => {
        const { headers } = req
        const { authorization } = headers

        if (!authorization) {
            console.log('test')
            return res.status(401).json(`Authorization header is required!`)
        }

        const [keyword, token] = authorization.split(` `)

        if (keyword.toLowerCase() !== `bearer` || !token) {
            console.log('test2')
            return res
                .status(401)
                .json(
                    `Authorization header must be in the "bearer <token>" format!`
                )
        }

        try {
            const user = await admin.auth().verifyIdToken(token)
            const { uid } = user

            const userDocument = await userService.getUserByUid(uid)
            if (!userDocument) {
                console.log('test3')
                return res.status(401).json(`User does not exist in mongo!`)
            }

            res.locals.user = userDocument

            const { isAdmin } = userDocument

            if (isAdmin) {
                res.locals.isAdmin = true
            } else {
                res.locals.isAdmin = false
            }
        } catch (e) {
            console.error(e)
            console.log('test5')
            return res
                .status(401)
                .json({ message: `An invalid token was supplied!` })
        }

        return next()
    })
}
