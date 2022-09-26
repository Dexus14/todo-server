import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

interface UserCredentialsRequiredData {
    email: string
    password: string
    username: string
}

interface TodoRequiredData {
    title: string
    description: string
    user: string
}

export async function createUser(userCredentials: UserCredentialsRequiredData) {
    const { username, email, password } = userCredentials
    const hashedPassword = await bcrypt.hash(password, 10)

    return await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword
        }
    })
}

export async function createTodo(userCredentials: TodoRequiredData) {
    const { title, description, user } = userCredentials

    return await prisma.todo.create({
        data: {
            title,
            description,
            userId: user
        }
    })
}

export async function getTodosByUser(userId: string) {
    return await prisma.todo.findMany({
        where: {
            userId
        }
    })
}

export async function deleteTodoById(todoId: string) {
    return await prisma.todo.delete({
        where: {
            id: todoId
        }
    })
}

export async function getUserByUsername(username: string) {
    return await prisma.user.findFirst({
        where: {
            username
        }
    })
}

export async function getUserByEmail(email: string) {
    return await prisma.user.findFirst({
        where: {
            email
        }
    })
}
