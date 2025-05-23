export interface Register {
  email: string;
  password: string;
  password_confirm: string;
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
  conhecimento_investimento: "beginner" | "intermediate" | "advanced";
  aceita_termos: boolean;
}
