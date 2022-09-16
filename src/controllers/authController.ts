import { Request, Response } from "express";
import { validate } from 'email-validator'
import { createUser } from "../services/database.service";
import passport from "passport";
import jwt from 'jsonwebtoken'
import path from 'path'

export function auth_login_get(req: Request, res: Response) {
    res.sendFile(path.join(__dirname + '/../view/login/index.html'))
}

export async function auth_login_post(req: Request, res: Response, next: any) {
    passport.authenticate(
        'login',
        async (err, user, info) => {
            try {                
                if(err || !user)
                    return res.send('err' + err) // TODO: Handle error
                
                req.login(
                    user,
                    { session: false },
                    async err => {
                        if(err)
                            return res.send('error2') // TODO: Handle error
                        
                        const body = { id: user.id, email: user.email }
                        const token = jwt.sign({ user: body }, 'TOP_SECRET') // FIXME: What is 'TOP_SECRET'?

                        return res.json({ token })
                    }
                )
            } catch(err) {
                return res.send('err' + err) // TODO: ERR
            }
        }
    )(req, res, next)
}

export function auth_register_get(req: Request, res: Response) {
    res.send('sdgsdgsd')
}

export async function auth_register_post(req: Request, res: Response) {
    res.json({ message: 'success', user: req.user })
    // const { email, username, password } = req.body

    // console.log(req.body);
    
    // if(!email)
    //     return res.send('No email.')
    // if(!validate(email))
    //     return res.send('Invalid email.')
    // if(!username)
    //     return res.send('No username.')
    // if(!password)
    //     return res.send('No password.')
    
    // try {
    //     console.log(await createUser({ username, email, password }))
    //     res.send('User added!')
    // } catch(err) {
    //     res.send('Error!')
    // }

}
