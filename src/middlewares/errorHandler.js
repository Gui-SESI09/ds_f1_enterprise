export function errorHandler(error, request, reply) {
    
    console.error("Erro capturado pelo Handler:", error);
    reply.status(500).send({message: error.message || "Ocorreu um erro interno no servidor."});
}