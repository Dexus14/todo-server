import { Request, Response } from "express";
import passport from "passport";
import jwt from 'jsonwebtoken'
import { validate } from "email-validator";
import {createUser} from "../services/database.service";

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
                            return res.sendStatus(500) // FIXME: Change this?
                        
                        const body = { id: user.id, email: user.email }
                        const token = jwt.sign({ user: body }, 'TOP_SECRET') // FIXME: What is 'TOP_SECRET'?

                        return res.cookie('jwt', token).redirect('../..')
                    }
                )
            } catch(err) {
                return res.send('err' + err) // TODO: ERR
            }
        }
    )(req, res, next)
}

export function auth_register_get(req: Request, res: Response) {
    res.render('register', { title: 'TODO | Login', error: null})
}

export async function auth_register_post(req: Request, res: Response) {
    const { username, email, password, repeatPassword } = req.body

    if(password !== repeatPassword) 
        res.redirect('./?error=passwordmatch')

    if(username.length < 5 || username.length > 20)
        res.redirect('./?error=usernamelength')

    if(!validate(email))
        res.redirect('./?error=incorrectemail')

    await createUser({ username, email, password })

    res.redirect('../..')
}

export async function auth_logout_get(req: Request, res: Response) {
    res.clearCookie('jwt').redirect('login')
}
