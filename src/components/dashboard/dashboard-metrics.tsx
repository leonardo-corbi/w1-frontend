"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, Target } from "lucide-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Metrics {
  totalPredictions: number;
  holdingConversions: number;
  highRiskClients: number;
  modelAccuracy: number;
  trends: {
    predictions: number;
    conversions: number;
    risk: number;
  };
  distributionData: Array<{ label: string; value: number; color: string }>;
  holdingData: Array<{ label: string; value: number; color: string }>;
  matriz_holding_url: string;
  matriz_churn_url: string;
  importancia_holding_url: string;
  importancia_churn_url: string;
}

export default function DashboardMetrics() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}metrics`
        );
        if (response.ok) {
          const data = await response.json();
          setMetrics(data);
        } else {
          throw new Error("Failed to fetch metrics");
        }
      } catch (error) {
        console.error("Erro ao buscar métricas:", error);
        alert("Erro ao buscar métricas. Tente novamente.");
      }
    };
    fetchMetrics();
  }, []);

  if (!metrics) {
    return <div>Carregando métricas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Previsões
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.totalPredictions.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {metrics.trends.predictions >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              )}
              {metrics.trends.predictions}% este mês
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conversões Holding
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.holdingConversions.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {metrics.trends.conversions >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              )}
              {metrics.trends.conversions}% este mês
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Clientes Alto Risco
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.highRiskClients.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {metrics.trends.risk >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1 text-orange-500" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              )}
              {metrics.trends.risk}% este mês
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Acurácia do Modelo
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.modelAccuracy.toFixed(1)}%
            </div>
            <Progress value={metrics.modelAccuracy} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Risco de Churn</CardTitle>
            <CardDescription>
              Classificação dos clientes por nível de risco
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="chart-container">
              <Pie
                className="chart-canvas"
                data={{
                  labels: metrics.distributionData.map((item) => item.label),
                  datasets: [
                    {
                      data: metrics.distributionData.map((item) => item.value),
                      backgroundColor: metrics.distributionData.map(
                        (item) => item.color
                      ),
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { position: "top" } },
                }}
              />
            </div>
            <img
              src={metrics.matriz_churn_url}
              alt="Matriz de Confusão - Churn"
              className="mt-4 max-w-full h-auto"
            />
            {metrics.distributionData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{item.label}</span>
                  <Badge variant="outline">{item.value.toFixed(1)}%</Badge>
                </div>
                <Progress value={item.value} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Previsões de Holding</CardTitle>
            <CardDescription>
              Distribuição das previsões de abertura de holding
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="chart-container">
              <Pie
                className="chart-canvas"
                data={{
                  labels: metrics.holdingData.map((item) => item.label),
                  datasets: [
                    {
                      data: metrics.holdingData.map((item) => item.value),
                      backgroundColor: metrics.holdingData.map(
                        (item) => item.color
                      ),
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { position: "top" } },
                }}
              />
            </div>
            <img
              src={metrics.matriz_holding_url}
              alt="Matriz de Confusão - Holding"
              className="mt-4 max-w-full h-auto"
            />
            {metrics.holdingData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    Abertura: {item.label}
                  </span>
                  <Badge variant="outline">{item.value.toFixed(1)}%</Badge>
                </div>
                <Progress value={item.value} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Insights e Recomendações</CardTitle>
          <CardDescription>
            Análises baseadas nos dados de previsão
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-green-700 mb-2">
                Oportunidade
              </h4>
              <p className="text-sm text-gray-600">
                {metrics.highRiskClients} clientes com alto risco de churn podem
                ser retidos com ações proativas
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-blue-700 mb-2">Tendência</h4>
              <p className="text-sm text-gray-600">
                Aumento de {metrics.trends.predictions}% nas previsões indica
                crescimento na base de clientes
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-orange-700 mb-2">Atenção</h4>
              <p className="text-sm text-gray-600">
                Queda de {metrics.trends.conversions}% nas conversões de holding
                requer análise das estratégias
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
