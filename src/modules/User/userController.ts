import { FastifyReply, FastifyRequest } from "fastify";
import { createUserSchema, login } from "./userSchema";
import { createUser, findUserEmail, findUsers } from "./userService";
import { compare } from "bcrypt";

export const registerUserHandler = async (req: FastifyRequest<{Body: createUserSchema}>, 
    rep: FastifyReply) => {
        const Body = req.body

        try {
            const user = await createUser(Body)

            return rep.code(200).send({
                id: user.id,
                email: user.email,
                name: user.name
            })
        } catch (error) {
            console.error(error)
            return rep.code(500).send(error)
        }
}

export const loginHandler = async (req: FastifyRequest<{Body: login}>, rep: FastifyReply) => {
    const body = req.body

    const user = await findUserEmail(body.email)

    if(!user) {
        return rep.code(404).send('User not found')
    }

    const validPassword = await compare(body.password, user!.password)

    if(!validPassword) {
        return rep.code(401).send('Invalid password')
    }

    if(await validPassword) {
        const accessToken = req.jwt.sign({
            id: user.id
        }, {
            expiresIn: '7d'
        })
        return rep.code(200).send({
            accessToken,
            user: {
                id: user.id,
                email: user.email,
            }
        })
    }
    return rep.code(401).send({
        message: 'Invalid email or password'
    })
}

export async function getUsersHandler() {
    const users = await findUsers()

    return users
}