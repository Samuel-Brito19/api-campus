import {hash} from 'bcrypt'
import { prisma } from '../../database'
import { completeUser, createUserSchema } from './userSchema'

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

export const updateUser = async (params: completeUser) => {
    const updateUser = await prisma.user.update({
        where: {
            id: params.id
        },
        data: {
            name: params.name,
            email: params.email,
            password: params.password
        }
    })

    return updateUser
} 

export const deleteUser = async (id: number) => {
    return await prisma.user.delete({
        where: {
            id
        }
    })
}