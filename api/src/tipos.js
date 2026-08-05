/**
 * @typedef {"Prospecção"
 *   | "Contato Realizado"
 *   | "Proposta Enviada"
 *   | "Em Negociação"
 *   | "Parceria Fechada"
 *   | "Não Sucedida"
 *   | "Ex-Parceiro"} StatusCrm
 */

/** @type {StatusCrm[]} */
export const STATUS_CRM = [
  "Prospecção",
  "Contato Realizado",
  "Proposta Enviada",
  "Em Negociação",
  "Parceria Fechada",
  "Não Sucedida",
  "Ex-Parceiro",
];

/**
 * @typedef {Object} Patrocinador
 * @property {number} id
 * @property {string} razao_social
 * @property {string} cnpj
 * @property {string | null} nome_contato
 * @property {string | null} email
 * @property {string | null} telefone
 * @property {string | null} nicho
 * @property {string | null} area_colaboracao
 * @property {StatusCrm} status_crm
 * @property {number | null} usuario_id
 */

/**
 * @typedef {Object} Usuario
 * @property {number} id
 * @property {string} nome
 * @property {string} email
 * @property {boolean} ativo
 */

export {};
