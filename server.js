import Fastify from "fastify";
import { Pool } from "pg";

const sql = new Pool ({
    host: 'localhost',
    database: 'ds_f1_enterprise',
    user: 'postgres',
    password: 'senai',
    port: 5432
});

const servidor = Fastify();

servidor.get('/usuario', () => {
    return sql.query('select * from usuarios')
})

servidor.post('/usuario', async (request, reply) => {
    const body = request.body;
     if (!body || !body.nome || !body.email || !body.senha_hash){
        reply.status(400).send({error:"Preencha todas as informações corretamente!"})
    }
    const resultado = await sql.query(`INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3)`, [body.nome, body.email, body.senha_hash]);
    reply.status(200).send({message: "Tudo foi inserido corretamente."})
})
    

servidor.put('/usuario/:id', async (request, reply) => {
    const id = request.params.id;
    const body = request.body;
    const resultado = await sql.query(`UPDATE usuarios SET nome = $1, email = $2, senha_hash = $3 WHERE id = $4 RETURNING nome`, [body.nome, body.email, body.senha_hash, id]) 
    const nomeAtualizado = resultado.rows[0].nome
    reply.status(200).send({message: "Os dados do usuario: " + nomeAtualizado + " foram atualizados!"})
    
    if (resultado.rows.length === 0) {
        reply.status(404).send({message: "O ID inserido não foi encontrado no sistema."})
    }
})

/*
servidor.delete()

*/

servidor.listen({
    port: 3000
})
