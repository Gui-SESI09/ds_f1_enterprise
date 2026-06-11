import Fastify from "fastify";
import { Pool } from "pg";
import rotasUsuario from "./src/routes/usuarios.js";

const sql = new Pool ({
    host: 'localhost',
    database: 'ds_f1_enterprise',
    user: 'postgres',
    password: 'senai',
    port: 5432
});

const servidor = Fastify();

servidor.register(rotasUsuario, { sql });

servidor.listen({
    port: 3000
});