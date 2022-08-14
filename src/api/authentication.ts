import { Application } from 'express'

import admin from 'firebase-admin'
import { UserService } from '../services'

export const authenticationRoutes = (app: Application) => {
    const userService = UserService()

    app.use(async (req, res, next) => {
        const { headers } = req
        const { authorization } = headers

        if (!authorization)
            return res.status(401).json(`Authorization header is required!`)

        const [keyword, token] = authorization.split(` `)

        if (keyword.toLowerCase() !== `bearer` || !token)
            return res
                .status(401)
                .json(
                    `Authorization header must be in the "bearer <token>" format!`
                )

        try {
            const user = await admin.auth().verifyIdToken(token)
            const { uid } = user

            const userDocument = await userService.getUserByUid(uid)
            if (!userDocument)
                return res.status(401).json(`User does not exist in mongo!`)

            res.locals.user = userDocument
            res.locals.roles = []

            const { isAdmin } = userDocument

            if (isAdmin) {
                res.locals.isAdmin = true
            } else {
                res.locals.isAdmin = false
            }

            if (res.locals.roles.length === 0)
                return res.status(401).json(`The user has no role assigned!`)
        } catch (e) {
            console.error(e)
            return res
                .status(401)
                .json({ message: `An invalid token was supplied!` })
        }

        return next()
    })
}
