
import fjwt, { JWT } from "@fastify/jwt";
import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import cors from "@fastify/cors";

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

    return fastify
}

export default buildServer;