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
} from "@/components/ui/card";
import { formatCurrency, formatDate, getConhecimentoLabel } from "@/lib/utils";
import { Target, Building2, Bell, Wallet, CheckCircle2 } from "lucide-react";

interface OverviewProps {
  user: CustomUser | null;
  patrimonios: Patrimonio[];
  objetivos: Objetivo[];
  holdings: Holding[];
  documentos: Documento[];
  processos: Processo[];
  notificacoes: Notificacao[];
}

export function Overview({
  user,
  patrimonios,
  objetivos,
  holdings,
  documentos,
  processos,
  notificacoes,
}: OverviewProps) {
  // Calculate total patrimonio value
  const totalPatrimonioValue = patrimonios.reduce(
    (total, patrimonio) => total + (patrimonio.valor || 0),
    0
  );

  // Calculate total objetivo value
  const totalObjetivoValue = objetivos.reduce(
    (total, objetivo) => total + Number.parseFloat(objetivo.valor_alvo || "0"),
    0
  );

  // Count completed objetivos
  const completedObjetivos = objetivos.filter(
    (objetivo) => objetivo.status === "completed"
  ).length;

  // Count unread notifications
  const unreadNotifications = notificacoes.filter(
    (notificacao) => !notificacao.is_lida
  ).length;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-navy-800 border-navy-700 bg-slate-400">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-navy-200">
              Total de Patrimônios
            </CardTitle>
            <Wallet className="h-4 w-4 text-navy-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(totalPatrimonioValue.toString())}
            </div>
            <p className="text-xs text-navy-300">
              {patrimonios.length} itens registrados
            </p>
          </CardContent>
        </Card>
        <Card className="bg-navy-800 border-navy-700 bg-slate-400">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-navy-200">
              Objetivos Financeiros
            </CardTitle>
            <Target className="h-4 w-4 text-navy-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(totalObjetivoValue.toString())}
            </div>
            <p className="text-xs text-navy-300">
              {completedObjetivos} de {objetivos.length} concluídos
            </p>
          </CardContent>
        </Card>
        <Card className="bg-navy-800 border-navy-700 bg-slate-400">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-navy-200">
              Holdings
            </CardTitle>
            <Building2 className="h-4 w-4 text-navy-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {holdings.length}
            </div>
            <p className="text-xs text-navy-300">
              {holdings.filter((h) => h.status === "approved").length} aprovadas
            </p>
          </CardContent>
        </Card>
        <Card className="bg-navy-800 border-navy-700 bg-slate-400">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-navy-200">
              Notificações
            </CardTitle>
            <Bell className="h-4 w-4 text-navy-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {unreadNotifications}
            </div>
            <p className="text-xs text-navy-300">
              Não lidas de {notificacoes.length} total
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2 bg-navy-800 border-navy-700 bg-slate-400">
          <CardHeader>
            <CardTitle className="text-white">Informações da Conta</CardTitle>
            <CardDescription className="text-navy-300">
              Seus dados pessoais e preferências
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-navy-300">
                  Nome completo
                </h3>
                <p className="mt-1 text-white">
                  {user?.nome} {user?.sobrenome}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-navy-300">Email</h3>
                <p className="mt-1 text-white">{user?.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-navy-300">CPF</h3>
                <p className="mt-1 text-white">{user?.cpf}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-navy-300">Telefone</h3>
                <p className="mt-1 text-white">{user?.telefone}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-navy-300">
                  Conhecimento em Investimentos
                </h3>
                <p className="mt-1 text-white">
                  {user?.conhecimento_investimento
                    ? getConhecimentoLabel(user.conhecimento_investimento)
                    : "Não informado"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-navy-300">Status</h3>
                <div className="mt-1 flex items-center text-white">
                  <CheckCircle2 className="mr-1 h-4 w-4 text-green-500" />
                  <span>Conta ativa</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-navy-800 border-navy-700 bg-slate-400">
          <CardHeader>
            <CardTitle className="text-white">Atividade Recente</CardTitle>
            <CardDescription className="text-navy-300">
              Últimas atualizações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notificacoes.slice(0, 5).map((notificacao) => (
                <div key={notificacao.id} className="flex items-start gap-4">
                  <div className="rounded-full bg-navy-700 p-2">
                    <Bell className="h-4 w-4 text-navy-300" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none text-white">
                      {notificacao.mensagem.length > 40
                        ? `${notificacao.mensagem.substring(0, 40)}...`
                        : notificacao.mensagem}
                    </p>
                    <p className="text-xs text-navy-300">
                      {formatDate(notificacao.data_envio)}
                    </p>
                  </div>
                </div>
              ))}
              {notificacoes.length === 0 && (
                <p className="text-sm text-navy-300">
                  Nenhuma atividade recente
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
