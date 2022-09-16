import express from 'express'
import { main_get } from '../controllers/mainController'

const router = express.Router()

router.get('/', main_get)

export default router
