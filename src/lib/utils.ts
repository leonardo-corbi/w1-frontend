import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR");
}

export function getPrioridadeVariant(
  prioridade: "baixa" | "media" | "alta"
): "default" | "secondary" | "destructive" | "outline" {
  const variants = {
    baixa: "secondary",
    media: "default",
    alta: "destructive",
  } as const; // Use 'as const' to make the object a readonly literal type
  return variants[prioridade] || "default";
}

export function getStatusVariant(
  status: "pending" | "processing" | "completed"
): "default" | "secondary" | "destructive" | "outline" {
  const variants = {
    pending: "secondary",
    processing: "default",
    completed: "outline",
  } as const; // Use 'as const' to make the object a readonly literal type
  return variants[status] || "default";
}

export function formatCurrency(value: string) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number.parseFloat(value) || 0);
}

export function getConhecimentoLabel(value: string) {
  const options = {
    beginner: "Iniciante",
    intermediate: "Intermediário",
    advanced: "Avançado",
  };
  return options[value as keyof typeof options] || value;
}

export function getCategoriaLabel(value: string) {
  const options = {
    retirement: "Aposentadoria",
    travel: "Viagem",
    real_estate: "Imóvel",
    vehicle: "Veículo",
    education: "Educação",
    health: "Saúde",
    business: "Negócio",
    other: "Outro",
  };
  return options[value as keyof typeof options] || value;
}

export function getPrioridadeLabel(value: string) {
  const options = {
    baixa: "Baixa",
    media: "Média",
    alta: "Alta",
  };
  return options[value as keyof typeof options] || value;
}

export function getStatusLabel(value: string) {
  const options = {
    pending: "Pendente",
    sent: "Enviado",
    approved: "Aprovado",
    rejected: "Rejeitado",
    processing: "Em Processo",
    completed: "Concluído",
    progress: "Em Progresso",
  };
  return options[value as keyof typeof options] || value;
}

export function getTipoNotificacaoLabel(value: string) {
  const options = {
    alert: "Alerta",
    update: "Atualização",
    request: "Solicitação",
  };
  return options[value as keyof typeof options] || value;
}
