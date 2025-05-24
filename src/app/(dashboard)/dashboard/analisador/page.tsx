"use client";

import { Suspense, useEffect, useState } from "react";
import PredictionForm from "@/components/dashboard/prediction-form";
import DashboardMetrics from "@/components/dashboard/dashboard-metrics";
import ModelPerformance from "@/components/dashboard/model-perfomance";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, TrendingUp, Users, AlertTriangle } from "lucide-react";

interface Stats {
  predictionsToday: number;
  modelAccuracy: number;
  clientsAnalyzed: number;
  highRiskChurn: number;
}

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}stats/`
        );
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          throw new Error("Failed to fetch stats");
        }
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
        alert("Erro ao buscar estatísticas. Tente novamente.");
      }
    };
    fetchStats();
  }, []);

  if (!stats) {
    return <div>Carregando estatísticas...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              AI Prediction Dashboard
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Previsões Hoje
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.predictionsToday.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Base total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Acurácia do Modelo
              </CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.modelAccuracy.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Média de holding e churn
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Clientes Analisados
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.clientsAnalyzed.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Total processado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Alto Risco Churn
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.highRiskChurn}</div>
              <p className="text-xs text-muted-foreground">Requer atenção</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="prediction" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="prediction">Nova Previsão</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="performance">Performance do Modelo</TabsTrigger>
          </TabsList>

          <TabsContent value="prediction" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Realizar Nova Previsão</CardTitle>
                <CardDescription>
                  Insira os dados do cliente para obter previsões de holding e
                  risco de churn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Carregando formulário...</div>}>
                  <PredictionForm />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <Suspense fallback={<div>Carregando dashboard...</div>}>
              <DashboardMetrics />
            </Suspense>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Suspense
              fallback={<div>Carregando métricas de performance...</div>}
            >
              <ModelPerformance />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
