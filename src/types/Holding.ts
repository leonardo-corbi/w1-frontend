export interface Holding {
  id: string;
  user_id: string;
  nome_holding: string;
  cnpj: string;
  status: "pending" | "approved" | "rejected";
  criado_em: string;
}
