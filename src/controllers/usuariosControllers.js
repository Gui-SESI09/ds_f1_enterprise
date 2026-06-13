export const usuariosController = {
    
    async get_u(request, reply, sql) {
       const resultado = await sql.query('SELECT * FROM usuarios');
       return resultado.rows;
    },
    
    async post_u (request, reply, sql) {
        const body = request.body;
            if (!body || !body.nome || !body.email || !body.senha_hash){
                reply.status(400).send({error:"Preencha todas as informações corretamente!"})
        }
        const resultado = await sql.query(`INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3)`, [body.nome, body.email, body.senha_hash]);
        reply.status(200).send({message: "Tudo foi inserido corretamente."})
    },

    async put_u (request, reply, sql) {
        const id = request.params.id;
        const body = request.body;
        const resultado = await sql.query(`UPDATE usuarios SET nome = $1, email = $2, senha_hash = $3 WHERE id = $4 RETURNING nome`, [body.nome, body.email, body.senha_hash, id]) 
        const nomeAtualizado = resultado.rows[0].nome
        reply.status(200).send({message: "Os dados do usuario: " + nomeAtualizado + " foram atualizados!"})
        
        if (resultado.rows.length === 0) {
            reply.status(404).send({message: "O ID inserido não foi encontrado no sistema."})
        }
    },
    
    async delete_u (request, reply, sql) {
        const id = request.params.id;
        const resultado = await sql.query(`DELETE FROM usuarios where id = $1`, [id]);
        reply.status(200).send({message:"O usuário com o id: " + id + " foi deletado com sucesso!"});
    }
}