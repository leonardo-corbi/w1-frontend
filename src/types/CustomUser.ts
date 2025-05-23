export interface CustomUser {
  id: string;
  email: string;
  nome: string;
  sobrenome: string;
  telefone: string;
  cpf: string;
  data_nascimento: string;
  cep: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  renda_mensal?: number;
  tem_patrimonio: boolean;
  tem_holding: boolean;
  conhecimento_investimento: "beginner" | "intermediate" | "advanced";
}
