
import fjwt, { JWT } from "@fastify/jwt";
import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import cors from "@fastify/cors";
import { userSchemas } from "./modules/User/userSchema";
import userRoutes from "./modules/User/userRoutes";

declare module "fastify" {
    interface FastifyRequest {
        jwt: JWT
    }
    export interface FastifyInstance {
        authenticate: any;
    }
}

function buildServer() {
    
    const fastify = Fastify({ logger: true });

    fastify.register(cors, {
        origin: "*"
    })

    fastify.register(fjwt, {secret: `${process.env.JWT_SECRET}`});

    fastify.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
        try {
          await request.jwtVerify()
        } catch (error) {
          reply.send(error)
        }
      })

    fastify.addHook("preHandler", (req, res, next) => {
        req.jwt = fastify.jwt
        return next()
    })

    for(const schema of [...userSchemas]) {
        fastify.addSchema(schema)
    }

    fastify.register(userRoutes, { prefix: "/users" });

    return fastify
}

export default buildServer;