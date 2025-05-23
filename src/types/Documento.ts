export interface Documento {
  id: string;
  holding_id: string;
  user_id: string;
  tipo_documento: string;
  url_arquivo: string;
  status: "pending" | "sent" | "approved" | "rejected";
  data_envio: string;
}
