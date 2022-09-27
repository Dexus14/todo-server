import { Request, Response } from "express"
import { createTodo, getTodosByUser, deleteTodoById } from '../services/database.service'

export async function main_get(req: Request, res: Response) {
    const user = req?.user as any
    const userId = user.id

    const messages = await req.consumeFlash('messages')

    const todos = await getTodosByUser(userId)    
    
    res.render('main', {
        title: 'TODO | Login',
        todos,
        messages
    })
}

export async function main_post(req: Request, res: Response) {        
    const { title, description } = req.body
    
    const user = req?.user as any
    const userId = user.id

    try {
        await createTodo({ title, description, user: userId })
    } catch(e) {
        return res.redirect('/?error=create')
    }
    
    res.redirect('.')
}

export async function main_todos_delete_post(req: Request, res: Response) {
    const { todoId } = req.body
    
    try {
        await deleteTodoById(todoId)
    } catch(e) {
        await req.flash('messages', 'Error while removing TODO.')
        return res.redirect('/')
    }

    res.redirect('/')
}
