export async function verificarJWT(request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    return reply.status(401).send({
      error: "Unauthorized",
      message: "Acesso negado. Token inválido ou ausente."
    });
  }
}