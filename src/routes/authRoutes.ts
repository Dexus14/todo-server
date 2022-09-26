import express from 'express'
import passport from 'passport'
import { auth_login_get, auth_register_get, auth_register_post, auth_login_post, auth_logout_get } from '../controllers/authController'

const router = express.Router()

router.get('/login', auth_login_get)
router.post('/login', auth_login_post)
router.get('/register', auth_register_get)
router.post('/register', passport.authenticate('register', { session: false }), auth_register_post)
router.get('/logout', auth_logout_get)


export default router
