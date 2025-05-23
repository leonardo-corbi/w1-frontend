// types/Objetivo.ts
export interface Objetivo {
  id: string;
  titulo: string;
  descricao: string;
  categoria:
    | "retirement"
    | "travel"
    | "real_estate"
    | "vehicle"
    | "education"
    | "health"
    | "business"
    | "other"
    | "";
  valor_alvo: string;
  valor_atual: string;
  data_alvo: string;
  aporte_mensal: string;
  prioridade: "baixa" | "media" | "alta";
  status: "pending" | "processing" | "completed";
  criado_em: string;
}
