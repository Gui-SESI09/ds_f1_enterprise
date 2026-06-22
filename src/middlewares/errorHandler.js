export function errorHandler(error, request, reply) {
    console.error("Erro capturado pelo Handler:", error);

    const statusCode = error.statusCode || 500;

    if (error.code === '23502' || error.message.includes('viola a restrição de não-nulo')) {
        return reply.status(400).send({
            error: "Bad Request",
            message: "Erro de validação: " + error.message
        });
    }

    reply.status(statusCode).send({
        error: statusCode === 500 ? "Internal Server Error" : "Error",
        message: error.message || "Ocorreu um erro interno no servidor."
    });
}