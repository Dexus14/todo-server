import express from 'express'
import authRoutes from './routes/authRoutes'
import mainRoutes from './routes/mainRoutes'
import passport from './services/auth.service'
require('dotenv').config()

const app = express()

app.listen(3002) // TODO: Change port to .env

// FIXME: uninstall bodyparses
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(passport.initialize())

app.use('/auth', authRoutes)
app.use('/', passport.authenticate('jwt', { session: false }), mainRoutes)

app.use((err: any, req: any, res: any) => {
    res.status(500)
    res.json({ error: err })
})
app.use((req, res) => res.status(404).send('Invalid route!'))
