import passportLocal from 'passport-local'
import { getUserByEmail, getUserByUsername } from './database.service'
import { validate } from 'email-validator'
import bcrypt from 'bcrypt'
import passportJWT from 'passport-jwt'
import passport from 'passport'

const localStrategy = passportLocal.Strategy

passport.use(
    'login',
    new localStrategy(
        {
            usernameField: 'username',
            passwordField: 'password'
        },
        async (username, password, done) => {
            let user = null
            try {
                if(validate(username))
                    user = await getUserByEmail(username)
                else
                    user = await getUserByUsername(username)

                if(user === null)
                    return done(null, false, { message: 'User not found.' })

                if(!(await bcrypt.compare(password, user.password))) 
                    return done(null, false, { message: 'Wrong password.' })
                                
                done(null, user, { message: 'Logged in successfully.' })
            } catch(err) {
                done(err)
            }
        }
    )
)


const cookieExtractor = (req: any) => {
    let jwt = null 

    if (req && req.cookies) {
        jwt = req.cookies['jwt']
    }

    return jwt
}

const JWTStrategy = passportJWT.Strategy
passport.use(
    'jwt',
    new JWTStrategy(
        {
            secretOrKey: process.env.JWT_PASSPHRASE,
            jwtFromRequest: cookieExtractor
        },
        async (token, done) => {
            try {                
                return done(null, token.user)
            } catch(err) {
                done(err)
            }
        }
    )
)

export default passport
