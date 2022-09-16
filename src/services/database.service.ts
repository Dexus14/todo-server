import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

interface UserCredentialsRequiredData {
    email: string
    password: string
    username: string
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

export async function getUserCredentialsByUsername(username: string) {
    return await prisma.user.findFirst({
        where: {
            username
        }
    })
}

export async function getUserCredentialsByEmail(email: string) {
    return await prisma.user.findFirst({
        where: {
            email
        }
    })
}
