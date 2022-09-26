import express from 'express'
import { main_get, main_post, main_todos_delete_post } from '../controllers/mainController'

const router = express.Router()

router.get('/', main_get)
router.post('/', main_post)
router.post('/todos/delete', main_todos_delete_post)

export default router
