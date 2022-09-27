import { Request, Response } from "express";
import passport from "passport";
import jwt from 'jsonwebtoken'
import { validate } from "email-validator";
import {createUser, getUserByEmail, getUserByUsername} from "../services/database.service";

export async function auth_login_get(req: Request, res: Response) {
    const messages = await req.consumeFlash('messages')

    res.render('login', { title: 'TODO | Login', messages })
}

export async function auth_login_post(req: Request, res: Response, next: any) {
    passport.authenticate(
        'login',
        async (err, user, info) => {
            try {
                if(info.message)
                    await req.flash('messages', info.message)

                if(err || !user) {
                    return res.redirect('./login')
                }

                req.login(
                    user,
                    { session: false },
                    async err => {
                        if(err)
                            return res.redirect('./login')

                        const body = { id: user.id, email: user.email }
                        const passphrase = process.env.JWT_PASSPHRASE as string
                        const token = jwt.sign({ user: body }, passphrase)

                        return res.cookie('jwt', token, { maxAge: 86_400_000 }).redirect('../..')
                    }
                )
            } catch(err) {
                return res.redirect('./login')
            }
        }
    )(req, res, next)
}

export async function auth_register_get(req: Request, res: Response) {
    const messages = await req.consumeFlash('messages')

    const username = await req.consumeFlash('username')
    const email = await req.consumeFlash('email')

    console.log(messages)
    res.render('register', { title: 'TODO | Register', messages, username, email })
}

export async function auth_register_post(req: Request, res: Response) {
    const { username, email, password, repeatPassword } = req.body

    const messages = []

    if(username.length < 5)
        messages.push('Username is too short.')

    if(username.length > 20)
        messages.push('Username is too long.')

    if(!validate(email))
        messages.push('Invalid email.')

    if(await getUserByUsername(username) !== null)
        messages.push('This username is already in use.')

    if(await getUserByEmail(email) !== null)
        messages.push('This email is already in use.')

    if(password !== repeatPassword)
        messages.push('Passwords do not match.')

    if(messages.length > 0) {
        for(const msg of messages) {
            await req.flash('messages', msg)
        }
        await req.flash('email', email)
        await req.flash('username', username)
        return res.redirect('./register')
    }

    await createUser({ username, email, password })

    return res.redirect('../..')
}

export async function auth_logout_get(req: Request, res: Response) {
    res.clearCookie('jwt').redirect('login')
}
