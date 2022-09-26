import { Request, Response } from "express"
import { createTodo, getTodosByUser, deleteTodoById } from '../services/database.service'

export async function main_get(req: Request, res: Response) {
    const user = req?.user as any // FIXME: Fix type - set to prisma one
    const userId = user.id

    const error = req.query.error ?? null    

    const todos = await getTodosByUser(userId)    
    
    res.render('main', {
        title: 'TODO | Login',
        todos,
        error
    })
}

export async function main_post(req: Request, res: Response) {        
    const { title, description } = req.body // FIXME: Add additioonal checking
    
    const user = req?.user as any // FIXME: Fix type - set to prisma one
    const userId = user.id

    try {
        await createTodo({ title, description, user: userId })
    } catch(e) {
        return res.redirect('/?error=create')
    }
    
    res.redirect('.')
}

export async function main_todos_delete_post(req: Request, res: Response) {
    // TODO: Add success / fail parameter    
    const { todoId } = req.body
    
    try {
        await deleteTodoById(todoId)
    } catch(e) {
        return res.redirect('/?error=delete')
    }

    res.redirect('/')
}
