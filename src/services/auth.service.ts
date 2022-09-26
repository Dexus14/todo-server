import passportLocal from 'passport-local'
import { createUser, getUserCredentialsByEmail, getUserCredentialsByUsername } from './database.service'
import { validate } from 'email-validator'
import bcrypt from 'bcrypt'
import passportJWT from 'passport-jwt'
import passport from 'passport'

const localStrategy = passportLocal.Strategy
passport.use(
    'register',
    new localStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        async (req, username, password, done) => {
            try {
                const { email } = req.body
                const user = await createUser({ username, email, password })
                done(null, user)
            } catch (err) {
                console.log('ODSJFGIGNOISDN') // FIXME: Create error
                
                done(err)
            }
        }
    )
)

passport.use(
    'login',
    new localStrategy(
        {
            usernameField: 'username',
            passwordField: 'password'
        },
        async (username, password, done) => {
            // FIXME: Add expiry date and refresh token
            // FIXME: User has only credentials
            let user = null
            try {
                // Check if username passed by the user is an email.
                // FIXME: User can possibly set username that is an email - add username validation.
                if(validate(username))
                    user = await getUserCredentialsByEmail(username)

                user = await getUserCredentialsByUsername(username)

                if(user === null)
                    return done(null, false, { message: 'User not found.' })

                // FIXME: Ugly if
                if(!(await bcrypt.compare(password, user.password))) 
                    return done(null, false, { message: 'Wrong password.' })
                                
                done(null, user, { message: 'Logged in successfully.' })
            } catch(err) {
                console.log('HEHEHEHE') // FIXME: Add error handling
                
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
const ExtractJWT = passportJWT.ExtractJwt
passport.use(
    'jwt',
    new JWTStrategy(
        {
            secretOrKey: 'TOP_SECRET', // FIXME: Change secret? Add expiry date?
            jwtFromRequest: cookieExtractor
        },
        async (token, done) => {
            try {                
                return done(null, token.user)
            } catch(err) {
                console.log('asdoasndoiansdfio') // FIXME: Add error handling
                
                done(err)
            }
        }
    )
)

export default passport
