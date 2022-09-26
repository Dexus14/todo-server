import { Request, Response } from "express";
import passport from "passport";
import jwt from 'jsonwebtoken'
import { validate } from "email-validator";
import {createUser, getUserByEmail, getUserByUsername} from "../services/database.service";

export function auth_login_get(req: Request, res: Response) {
    const error = req.query.error ?? 0

    res.render('login', { title: 'TODO | Login', error})
}

export async function auth_login_post(req: Request, res: Response, next: any) {
    passport.authenticate(
        'login',
        async (err, user, info) => {
            try {
                if(err || !user)
                    return res.redirect('./login?error=1')

                req.login(
                    user,
                    { session: false },
                    async err => {
                        if(err)
                            return res.redirect('./login?error=1')

                        const body = { id: user.id, email: user.email }
                        const passphrase = process.env.JWT_PASSPHRASE as string
                        const token = jwt.sign({ user: body }, passphrase)

                        return res.cookie('jwt', token, { maxAge: 86_400_000 }).redirect('../..')
                    }
                )
            } catch(err) {
                return res.redirect('./login?error=1')
            }
        }
    )(req, res, next)
}

export function auth_register_get(req: Request, res: Response) {
    const error = req.query.error
    res.render('register', { title: 'TODO | Register', error })
}

export async function auth_register_post(req: Request, res: Response) {
    const { username, email, password, repeatPassword } = req.body

    if(
        username.length < 5 ||
        username.length > 20 ||
        !validate(email) ||
        password !== repeatPassword ||
        await getUserByUsername(username) !== null ||
        await getUserByEmail(email) !== null
    )
        return res.redirect('./register?error=1')

    await createUser({ username, email, password })

    return res.redirect('../..')
}

export async function auth_logout_get(req: Request, res: Response) {
    res.clearCookie('jwt').redirect('login')
}
