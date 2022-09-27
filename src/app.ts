import express from 'express'
import authRoutes from './routes/authRoutes'
import mainRoutes from './routes/mainRoutes'
import passport from './services/auth.service'
import cookieParser from 'cookie-parser'
import session from "express-session"
import {flash} from "express-flash-message";
require('dotenv').config()

const app = express()

app.listen(process.env.PORT)

// FIXME: uninstall bodyparses
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(
    session({
        secret: 'test-secret', // FIXME: Change
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60
        }
    })
)

app.use(flash({ sessionKeyName: 'flashMessage' }))

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))

app.use(passport.initialize())

app.use('/auth', authRoutes)
app.use('/', passport.authenticate('jwt', { session: false, failureRedirect: '/auth/login' }), mainRoutes)

app.use((req, res) => res.status(404).send('Invalid route!'))
