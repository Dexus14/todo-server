import express from 'express'
import authRoutes from './routes/authRoutes'
import mainRoutes from './routes/mainRoutes'
import passport from './services/auth.service'
import cookieParser from 'cookie-parser'
require('dotenv').config()

const app = express()

app.listen(3002) // TODO: Change port to .env

// FIXME: uninstall bodyparses
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))

app.use(passport.initialize())

app.use('/auth', authRoutes)
app.use('/', passport.authenticate('jwt', { session: false, failureRedirect: '/auth/login' }), mainRoutes)

app.use((req, res) => res.status(404).send('Invalid route!'))
