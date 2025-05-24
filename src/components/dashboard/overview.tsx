import Link from "next/link";
import type { CustomUser } from "@/types/CustomUser";
import type { Patrimonio } from "@/types/Patrimonio";
import type { Objetivo } from "@/types/Objetivo";
import type { Holding } from "@/types/Holding";
import type { Documento } from "@/types/Documento";
import type { Processo } from "@/types/Processo";
import type { Notificacao } from "@/types/Notificacao";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Assuming path is correct
import { formatCurrency, formatDate, getConhecimentoLabel } from "@/lib/utils"; // Assuming path is correct
import {
  Target,
  Building2,
  Bell,
  Wallet,
  CheckCircle2,
  TrendingUp,
  FileText,
  ListChecks,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Use Avatar for user info
import { Badge } from "@/components/ui/badge"; // Use Badge for status
import { ScrollArea } from "@/components/ui/scroll-area"; // Use ScrollArea for recent activity
import { Separator } from "@/components/ui/separator"; // Use Separator for visual division
import { Button } from "@/components/ui/button";

interface OverviewProps {
  user: CustomUser | null;
  patrimonios: Patrimonio[];
  objetivos: Objetivo[];
  holdings: Holding[];
  documentos: Documento[];
  notificacoes: Notificacao[];
}

// Helper to get initials from name
const getInitials = (name: string | undefined) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

export function Overview({
  user,
  patrimonios,
  objetivos,
  holdings,
  documentos,
  notificacoes,
}: OverviewProps) {
  const totalPatrimonioValue = patrimonios.reduce(
    (total, patrimonio) => total + (patrimonio.valor || 0),
    0
  );
  const totalObjetivoValue = objetivos.reduce(
    (total, objetivo) => total + Number.parseFloat(objetivo.valor_alvo || "0"),
    0
  );
  const completedObjetivos = objetivos.filter(
    (objetivo) => objetivo.status === "completed"
  ).length;
  const unreadNotifications = notificacoes.filter(
    (notificacao) => !notificacao.is_lida
  ).length;

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Section Title */}
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
        Visão Geral
      </h1>

      {/* Key Metrics Cards - Refined Styling */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Patrimônio Total
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(totalPatrimonioValue.toString())}
            </div>
            <p className="text-xs text-muted-foreground">
              {patrimonios.length} itens registrados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Valor dos Objetivos
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(totalObjetivoValue.toString())}
            </div>
            <p className="text-xs text-muted-foreground">
              {completedObjetivos} de {objetivos.length} concluídos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Holdings Ativas
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {holdings.filter((h) => h.status === "approved").length}
            </div>
            <p className="text-xs text-muted-foreground">
              de {holdings.length} totais
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Notificações Novas
            </CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {unreadNotifications}
            </div>
            <p className="text-xs text-muted-foreground">
              de {notificacoes.length} totais
            </p>
          </CardContent>
        </Card>
      </div>

      {/* User Info and Recent Activity Cards - Refined Layout */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
        {/* User Information Card - Refined */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex md:flex-row justify-between flex-col py-4">
              <CardTitle className="text-lg font-semibold text-foreground">
                Informações da Conta
              </CardTitle>
              <Link href="/dashboard/me">
                <Button>Editar conta</Button>
              </Link>
            </div>
            <CardDescription className="text-muted-foreground">
              Seus dados pessoais e preferências.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                {/* Add user avatar image if available */}
                {/* <AvatarImage src={user?.avatarUrl} alt={`${user?.nome} ${user?.sobrenome}`} /> */}
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(`${user?.nome} ${user?.sobrenome}`)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">
                  {user?.nome} {user?.sobrenome}
                </p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-1 gap-x-4 gap-y-3 text-sm sm:grid-cols-2">
              <div>
                <span className="font-medium text-muted-foreground">CPF:</span>
                <span className="ml-2 text-foreground">{user?.cpf || "-"}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">
                  Telefone:
                </span>
                <span className="ml-2 text-foreground">
                  {user?.telefone || "-"}
                </span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">
                  Conhecimento:
                </span>
                <span className="ml-2 text-foreground">
                  {user?.conhecimento_investimento
                    ? getConhecimentoLabel(user.conhecimento_investimento)
                    : "Não informado"}
                </span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">
                  Status:
                </span>
                <Badge variant="default" className="ml-2">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Ativa
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
