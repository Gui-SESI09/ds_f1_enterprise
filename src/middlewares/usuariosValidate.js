export async function validarUsuario(request, reply) {
    const body = request.body;

    if (!body || !body.nome || !body.email || !body.senha_hash) {
        return reply.status(400).send({ message: "Preencha todas as informações corretamente!" });
    }
}