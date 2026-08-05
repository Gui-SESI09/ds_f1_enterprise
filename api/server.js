import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import { Pool } from "pg";
import morgan from "morgan";

import rotasUsuario from "./src/routes/usuarios.js";
import rotasPatrocinador from "./src/routes/patrocinadores.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";

const sql = new Pool({
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "ds_f1_enterprise",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "senai",
  port: Number(process.env.DB_PORT) || 5432,
});

const servidor = Fastify();

await servidor.register(cors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
});

servidor.register(fastifyJwt, { secret: process.env.JWT_SECRET || "senhasegura" });

const logger = morgan("dev");
servidor.addHook("onRequest", (request, reply, done) => {
  logger(request.raw, reply.raw, done);
});

servidor.setErrorHandler(errorHandler);

servidor.register(rotasUsuario, { sql });
servidor.register(rotasPatrocinador, { sql });

servidor.setNotFoundHandler((request, reply) => {
  reply
    .status(404)
    .send({ message: `A rota ${request.method} ${request.url} não foi encontrada no sistema!` });
});

servidor.listen({ port: 3000 }, () => {
  console.log("API no ar em http://localhost:3000");
});
