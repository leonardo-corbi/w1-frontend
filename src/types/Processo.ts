export interface Processo {
  id: string;
  holding_id: string;
  etapa: string;
  status: "pending" | "progress" | "completed";
  data_inicio: string;
  data_fim?: string;
}
