// types/CustomUser.ts
export interface CustomUser {
  id: string;
  email: string;
  nome: string;
  sobrenome: string;
  telefone: string;
  cpf: string;
  data_nascimento: string;
  data_registro: string;
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
  patrimonio?: number;
  conhecimento_investimento: "beginner" | "intermediate" | "advanced";
  cargo?: string;
  is_active: boolean;
  is_verified: boolean;
  is_staff: boolean;
  data_atualizacao?: string;
  data_contratacao?: string;
  aceita_termos: boolean;
}
