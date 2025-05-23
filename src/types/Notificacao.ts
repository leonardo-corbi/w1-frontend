export interface Notificacao {
  id: string;
  user_id: string;
  mensagem: string;
  tipo: "alert" | "update" | "request";
  data_envio: string;
  is_lida: boolean;
}
