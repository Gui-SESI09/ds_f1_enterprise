import { STATUS_CRM } from "../tipos.js";

export async function validarPatrocinador(request, reply) {
  const body = request.body;

  if (!body) {
    return reply.status(400).send({ erro: "Envie os dados do patrocinador." });
  }

  if (typeof body.razao_social !== "string" || body.razao_social.trim() === "") {
    return reply.status(400).send({ erro: "O campo razao_social é obrigatório." });
  }

  if (typeof body.cnpj !== "string" || body.cnpj.trim() === "") {
    return reply.status(400).send({ erro: "O campo cnpj é obrigatório." });
  }

  if (body.status_crm && !STATUS_CRM.includes(body.status_crm)) {
    return reply.status(400).send({
      erro: `status_crm inválido. Use um destes: ${STATUS_CRM.join(", ")}`,
    });
  }
}

export async function validarPatrocinadorParcial(request, reply) {
  const body = request.body;

  if (!body || Object.keys(body).length === 0) {
    return reply.status(400).send({ erro: "Envie ao menos um campo para atualizar." });
  }

  if (body.razao_social !== undefined && String(body.razao_social).trim() === "") {
    return reply.status(400).send({ erro: "razao_social não pode ficar vazia." });
  }

  if (body.status_crm && !STATUS_CRM.includes(body.status_crm)) {
    return reply.status(400).send({
      erro: `status_crm inválido. Use um destes: ${STATUS_CRM.join(", ")}`,
    });
  }
}
