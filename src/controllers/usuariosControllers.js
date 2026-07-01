import bcrypt from 'bcrypt';

export const usuariosController = {
    
    async get_u(request, reply, sql) {
       const resultado = await sql.query('SELECT * FROM usuarios');
       return resultado.rows;
    },
    
    async post_u (request, reply, sql) {
        const body = request.body;
        const resultado = await sql.query(`INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3)`, [body.nome, body.email, body.senha_hash]);
        reply.status(201).send({message: "Tudo foi inserido corretamente."})
    },

    async put_u (request, reply, sql) {
        const id = request.params.id;
        const body = request.body;
        const resultado = await sql.query(`UPDATE usuarios SET nome = $1, email = $2, senha_hash = $3 WHERE id = $4 RETURNING nome`, [body.nome, body.email, body.senha_hash, id]);
        
        if (resultado.rows.length === 0) {
            reply.status(404).send({error: "O ID inserido não foi encontrado no sistema."})
        }
        
        const nomeAtualizado = resultado.rows[0].nome
        reply.status(200).send({message: "Os dados do usuario: " + nomeAtualizado + " foram atualizados!"});
    },
    
    async delete_u (request, reply, sql) {
        const id = request.params.id;
        const resultado = await sql.query(`DELETE FROM usuarios where id = $1`, [id]);
        reply.status(200).send({message:"O usuário com o id: " + id + " foi deletado com sucesso!"});
    },

    async login_u(request, reply, sql) {
    const body = request.body;

    const resultado = await sql.query(`SELECT * FROM usuarios WHERE email = $1 AND ativo = TRUE`, [body.email]);

    if (resultado.rows.length === 0) {
        return reply.status(401).send({ error: "Credenciais inválidas." });
    }

    const usuario = resultado.rows[0];
    const senhaCorreta = await bcrypt.compare(body.senha, usuario.senha_hash);

    if (!senhaCorreta) {
        return reply.status(401).send({ error: "Credenciais inválidas." });
    }

    const token = await reply.jwtSign(
        { id: usuario.id, email: usuario.email },
        { expiresIn: '8h' }
    );

    reply.status(200).send({ token });
    }
}