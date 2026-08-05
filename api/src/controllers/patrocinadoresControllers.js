const COLUNAS = `id, razao_social, cnpj, nome_contato, email,
                 telefone, nicho, area_colaboracao, status_crm, usuario_id`;

export const patrocinadoresController = {
  async get_p(request, reply, sql) {
    const { status } = request.query;

    if (status) {
      const resultado = await sql.query(
        `SELECT ${COLUNAS} FROM patrocinadores WHERE status_crm = $1::status_kanban ORDER BY id`,
        [status]
      );
      return reply.status(200).send(resultado.rows);
    }

    const resultado = await sql.query(
      `SELECT ${COLUNAS} FROM patrocinadores ORDER BY id`
    );
    return reply.status(200).send(resultado.rows);
  },

  async get_p_id(request, reply, sql) {
    const { id } = request.params;

    const resultado = await sql.query(
      `SELECT ${COLUNAS} FROM patrocinadores WHERE id = $1`,
      [id]
    );

    if (resultado.rows.length === 0) {
      return reply.status(404).send({ erro: "Patrocinador não encontrado." });
    }

    return reply.status(200).send(resultado.rows[0]);
  },

  async post_p(request, reply, sql) {
    const body = request.body;

    const resultado = await sql.query(
      `INSERT INTO patrocinadores
         (razao_social, cnpj, nome_contato, email, telefone,
          nicho, area_colaboracao, status_crm)
       VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8::status_kanban, 'Prospecção'))
       RETURNING ${COLUNAS}`,
      [
        body.razao_social.trim(),
        body.cnpj.trim(),
        body.nome_contato ?? null,
        body.email ?? null,
        body.telefone ?? null,
        body.nicho ?? null,
        body.area_colaboracao ?? null,
        body.status_crm ?? null,
      ]
    );

    return reply.status(201).send(resultado.rows[0]);
  },

  async put_p(request, reply, sql) {
    const { id } = request.params;
    const body = request.body;

    const resultado = await sql.query(
      `UPDATE patrocinadores SET
         razao_social     = COALESCE($1, razao_social),
         cnpj             = COALESCE($2, cnpj),
         nome_contato     = COALESCE($3, nome_contato),
         email            = COALESCE($4, email),
         telefone         = COALESCE($5, telefone),
         nicho            = COALESCE($6, nicho),
         area_colaboracao = COALESCE($7, area_colaboracao),
         status_crm       = COALESCE($8::status_kanban, status_crm)
       WHERE id = $9
       RETURNING ${COLUNAS}`,
      [
        body.razao_social ?? null,
        body.cnpj ?? null,
        body.nome_contato ?? null,
        body.email ?? null,
        body.telefone ?? null,
        body.nicho ?? null,
        body.area_colaboracao ?? null,
        body.status_crm ?? null,
        id,
      ]
    );

    if (resultado.rows.length === 0) {
      return reply.status(404).send({ erro: "Patrocinador não encontrado." });
    }

    return reply.status(200).send(resultado.rows[0]);
  },

  async delete_p(request, reply, sql) {
    const { id } = request.params;

    const resultado = await sql.query(
      `DELETE FROM patrocinadores WHERE id = $1 RETURNING id`,
      [id]
    );

    if (resultado.rows.length === 0) {
      return reply.status(404).send({ erro: "Patrocinador não encontrado." });
    }

    return reply.status(204).send();
  },
};
