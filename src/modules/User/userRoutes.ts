import { FastifyInstance } from "fastify"
import { getUsersHandler, loginHandler, registerUserHandler, updateUserHandler } from "./userController"
import { $ref } from "./userSchema"

const userRoutes = (server: FastifyInstance) => {
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
        schema: {
            body: $ref('createUserSchema'),
            response: {
                201: $ref('userNoPassword')
            }
        }
    }, updateUserHandler)

}

export default userRoutes
