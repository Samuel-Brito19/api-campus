import {hash} from 'bcrypt'
import { prisma } from '../../database'
import { createUserSchema } from './userSchema'

export const createUser = async (params: createUserSchema) => {
    const {password} = params

    const hashPassword = await hash(password, 8)

    const user = await prisma.user.create({
        data: {
            ...params,
            password: hashPassword
        }
    })
    return user

}

export const findUsers = async () => {
    return await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true
        }
    })
}