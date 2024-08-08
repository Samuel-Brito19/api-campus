import { buildJsonSchemas } from 'fastify-zod';
import { z } from 'zod';

const userCore = {
    email: z.string({
        required_error: 'Email is required',
        invalid_type_error: 'Email must be a string',
    }).email(),
    name: z.string()
}

const completeUser = z.object({
    ...userCore,
    id: z.number(),
    password: z.string()
})

const createUserSchema = z.object({
    ...userCore,
    password: z.string({
        required_error: 'Password is required',
        invalid_type_error: 'Password must be a string'
    }),
})

const userNoPassword = z.object({
    id: z.number(),
    ...userCore,

})

const loginSchema = z.object({
    email: z.string({
        required_error: 'Email is required',
        invalid_type_error: 'Email must be a string'
    }).email(),
    password: z.string()
})

const loginResponseSchema = z.object({
    accessToken: z.string()
})

export type createUserSchema = z.infer<typeof createUserSchema>;

export type completeUser = z.infer<typeof completeUser>;

export type login = z.infer<typeof loginSchema>;

export const {schemas: userSchemas, $ref} = buildJsonSchemas({
    createUserSchema,
    userNoPassword,
    loginSchema,
    loginResponseSchema,
    completeUser
})