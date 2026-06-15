import Fastify from "fastify";
import { Pool } from "pg";
import rotasUsuario from "./src/routes/usuarios.js";
import morgan from "morgan";
import { errorHandler } from "./src/middlewares/errorHandler.js";

const sql = new Pool ({
    host: 'localhost',
    database: 'ds_f1_enterprise',
    user: 'postgres',
    password: 'senai',
    port: 5432
});

const servidor = Fastify();

const logger = morgan ('dev');
servidor.addHook('onRequest', (request, reply, done) => {
    logger(request.raw, reply.raw, done);
});

servidor.setErrorHandler(errorHandler);

servidor.register(rotasUsuario, { sql });

servidor.setNotFoundHandler((request, reply) => {
    reply.status(404).send({message: `A rota ${request.method} ${request.url} não foi encontrada no sistema!`});
});

servidor.listen({ port: 3000 });