export type StatusCrm =
  | "Prospecção"
  | "Contato Realizado"
  | "Proposta Enviada"
  | "Em Negociação"
  | "Parceria Fechada"
  | "Não Sucedida"
  | "Ex-Parceiro";

export const STATUS_CRM: StatusCrm[] = [
  "Prospecção",
  "Contato Realizado",
  "Proposta Enviada",
  "Em Negociação",
  "Parceria Fechada",
  "Não Sucedida",
  "Ex-Parceiro",
];

export interface Patrocinador {
  id: number;
  razao_social: string;
  cnpj: string;
  nome_contato: string | null;
  email: string | null;
  telefone: string | null;
  nicho: string | null;
  area_colaboracao: string | null;
  status_crm: StatusCrm;
  usuario_id: number | null;
}
