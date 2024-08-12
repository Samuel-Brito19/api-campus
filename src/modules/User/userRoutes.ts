import { FastifyInstance } from "fastify"
import { deleteUserHandler, getUsersHandler, loginHandler, registerUserHandler, updateUserHandler } from "./userController"
import { $ref } from "./userSchema"

const userRoutes = async (server: FastifyInstance) => {
    server.post('/', {
        schema: {
            body: $ref('createUserSchema'),
            response: {
                200: $ref('userNoPassword')
            }
        }
    }, registerUserHandler)

    server.post('/login', {
        schema: {
            body: $ref('loginSchema'),
        }
    }, loginHandler)

    server.get('/', {
        preHandler: [server.authenticate]
    }, getUsersHandler)

    server.patch('/:id', {
        preHandler: [server.authenticate],
        schema: {
            body: $ref('createUserSchema'),
            response: {
                201: $ref('userNoPassword')
            }
        }
    }, updateUserHandler)

    server.delete('/:id', {
        preHandler: [server.authenticate]
    }, deleteUserHandler)

}

export default userRoutes
