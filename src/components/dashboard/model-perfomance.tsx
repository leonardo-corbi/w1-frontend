"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Chart as ChartJS, Tooltip, Legend } from "chart.js";
import { Scatter } from "react-chartjs-2";

ChartJS.register(Tooltip, Legend);

interface PerformanceData {
  holdingReport: {
    precision: { sim: number; nao: number };
    recall: { sim: number; nao: number };
    f1Score: { sim: number; nao: number };
    accuracy: number;
  };
  churnReport: {
    precision: { alto: number; medio: number; baixo: number };
    recall: { alto: number; medio: number; baixo: number };
    f1Score: { alto: number; medio: number; baixo: number };
    accuracy: number;
  };
  holdingMatrix: number[][];
  churnMatrix: number[][];
  featureImportance: Array<{ feature: string; importance: number }>;
  matriz_holding_url: string;
  matriz_churn_url: string;
  importancia_holding_url: string;
  importancia_churn_url: string;
}

export default function ModelPerformance() {
  const [data, setData] = useState<PerformanceData | null>(null);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}model-performance/`
        );
        if (response.ok) {
          const performanceData = await response.json();
          setData(performanceData);
        } else {
          throw new Error("Failed to fetch performance data");
        }
      } catch (error) {
        console.error("Erro ao buscar performance:", error);
        alert("Erro ao buscar performance. Tente novamente.");
      }
    };
    fetchPerformance();
  }, []);

  if (!data) {
    return <div>Carregando performance...</div>;
  }

  const formatPercentage = (
    value: number | undefined | null,
    decimals: number = 1
  ): string => {
    return typeof value === "number" && !isNaN(value)
      ? (value * 100).toFixed(decimals) + "%"
      : "N/A";
  };

  const getProgressValue = (value: number | undefined | null): number => {
    return typeof value === "number" && !isNaN(value) ? value * 100 : 0;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
          <TabsTrigger value="confusion">Matriz de Confusão</TabsTrigger>
          <TabsTrigger value="importance">Importância</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance - Previsão de Holding</CardTitle>
                <CardDescription>
                  Métricas de classificação para abertura de holding
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Acurácia Geral</span>
                  <Badge variant="default">
                    {formatPercentage(data.holdingReport.accuracy)}
                  </Badge>
                </div>
                <Progress
                  value={getProgressValue(data.holdingReport.accuracy)}
                />

                <div className="space-y-3">
                  <h4 className="font-semibold">Por Classe:</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Sim</span>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Precisão</span>
                          <span>
                            {formatPercentage(data.holdingReport.precision.sim)}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Recall</span>
                          <span>
                            {formatPercentage(data.holdingReport.recall.sim)}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>F1-Score</span>
                          <span>
                            {formatPercentage(data.holdingReport.f1Score.sim)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Não</span>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Precisão</span>
                          <span>
                            {formatPercentage(data.holdingReport.precision.nao)}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Recall</span>
                          <span>
                            {formatPercentage(data.holdingReport.recall.nao)}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>F1-Score</span>
                          <span>
                            {formatPercentage(data.holdingReport.f1Score.nao)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance - Risco de Churn</CardTitle>
                <CardDescription>
                  Métricas de classificação para risco de churn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Acurácia Geral</span>
                  <Badge variant="default">
                    {formatPercentage(data.churnReport.accuracy)}
                  </Badge>
                </div>
                <Progress value={getProgressValue(data.churnReport.accuracy)} />

                <div className="space-y-3">
                  <h4 className="font-semibold">Por Classe:</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {["alto", "medio", "baixo"].map((risk) => (
                      <div key={risk} className="space-y-2">
                        <span className="text-sm font-medium capitalize">
                          {risk}
                        </span>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Prec.</span>
                            <span>
                              {formatPercentage(
                                data.churnReport.precision[
                                  risk as keyof typeof data.churnReport.precision
                                ],
                                0
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Rec.</span>
                            <span>
                              {formatPercentage(
                                data.churnReport.recall[
                                  risk as keyof typeof data.churnReport.recall
                                ],
                                0
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>F1</span>
                            <span>
                              {formatPercentage(
                                data.churnReport.f1Score[
                                  risk as keyof typeof data.churnReport.f1Score
                                ],
                                0
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="confusion" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Matriz de Confusão - Holding</CardTitle>
                <CardDescription>
                  Análise de acertos e erros na previsão de holding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src={data.matriz_holding_url}
                  alt="Matriz de Confusão - Holding"
                  className="max-w-full h-auto"
                />
                <div className="text-xs text-gray-600 mt-4">
                  <div className="flex justify-between">
                    <span>Verdadeiros Positivos:</span>
                    <span>{data.holdingMatrix[1]?.[1] ?? "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Falsos Positivos:</span>
                    <span>{data.holdingMatrix[0]?.[1] ?? "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Verdadeiros Negativos:</span>
                    <span>{data.holdingMatrix[0]?.[0] ?? "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Falsos Negativos:</span>
                    <span>{data.holdingMatrix[1]?.[0] ?? "N/A"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Matriz de Confusão - Churn</CardTitle>
                <CardDescription>
                  Análise de acertos e erros na previsão de risco
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src={data.matriz_churn_url}
                  alt="Matriz de Confusão - Churn"
                  className="max-w-full h-auto"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="importance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Importância das Variáveis</CardTitle>
              <CardDescription>
                Ranking de importância das features no modelo Random Forest
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <img
                src={data.importancia_holding_url}
                alt="Importância - Holding"
                className="max-w-full h-auto"
              />
              {data.featureImportance.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      {item.feature.replace("_", " ")}
                    </span>
                    <Badge variant="outline">
                      {formatPercentage(item.importance)}
                    </Badge>
                  </div>
                  <Progress
                    value={getProgressValue(item.importance)}
                    className="h-3"
                  />
                </div>
              ))}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">
                  Insights sobre Importância:
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>
                    • Volume de Investimentos é o fator mais determinante (
                    {formatPercentage(data.featureImportance[0]?.importance)})
                  </li>
                  <li>
                    • Score de Relacionamento tem forte influência (
                    {formatPercentage(data.featureImportance[1]?.importance)})
                  </li>
                  <li>
                    • Idade do cliente é moderadamente importante (
                    {formatPercentage(data.featureImportance[2]?.importance)})
                  </li>
                  <li>
                    • Perfil de Risco tem menor impacto nas previsões (
                    {formatPercentage(data.featureImportance[4]?.importance)})
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Relatório Detalhado - Holding</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-mono text-xs bg-gray-50 p-4 rounded overflow-x-auto">
                  <pre>
                    {`Classification Report - Holding

              precision    recall  f1-score   support

         Não       ${formatPercentage(
           data.holdingReport.precision.nao,
           2
         )}      ${formatPercentage(
                      data.holdingReport.recall.nao,
                      2
                    )}      ${formatPercentage(
                      data.holdingReport.f1Score.nao,
                      2
                    )}      ${
                      (data.holdingMatrix[0]?.[0] ?? 0) +
                      (data.holdingMatrix[0]?.[1] ?? 0)
                    }
         Sim       ${formatPercentage(
           data.holdingReport.precision.sim,
           2
         )}      ${formatPercentage(
                      data.holdingReport.recall.sim,
                      2
                    )}      ${formatPercentage(
                      data.holdingReport.f1Score.sim,
                      2
                    )}      ${
                      (data.holdingMatrix[1]?.[0] ?? 0) +
                      (data.holdingMatrix[1]?.[1] ?? 0)
                    }

    accuracy                           ${formatPercentage(
      data.holdingReport.accuracy,
      2
    )}      ${
                      (data.holdingMatrix[0]?.[0] ?? 0) +
                      (data.holdingMatrix[0]?.[1] ?? 0) +
                      (data.holdingMatrix[1]?.[0] ?? 0) +
                      (data.holdingMatrix[1]?.[1] ?? 0)
                    }
   macro avg       ${formatPercentage(
     (data.holdingReport.precision.sim + data.holdingReport.precision.nao) / 2,
     2
   )}      ${formatPercentage(
                      (data.holdingReport.recall.sim +
                        data.holdingReport.recall.nao) /
                        2,
                      2
                    )}      ${formatPercentage(
                      (data.holdingReport.f1Score.sim +
                        data.holdingReport.f1Score.nao) /
                        2,
                      2
                    )}      ${
                      (data.holdingMatrix[0]?.[0] ?? 0) +
                      (data.holdingMatrix[0]?.[1] ?? 0) +
                      (data.holdingMatrix[1]?.[0] ?? 0) +
                      (data.holdingMatrix[1]?.[1] ?? 0)
                    }
weighted avg       ${formatPercentage(
                      data.holdingReport.accuracy,
                      2
                    )}      ${formatPercentage(
                      data.holdingReport.accuracy,
                      2
                    )}      ${formatPercentage(
                      data.holdingReport.accuracy,
                      2
                    )}      ${
                      (data.holdingMatrix[0]?.[0] ?? 0) +
                      (data.holdingMatrix[0]?.[1] ?? 0) +
                      (data.holdingMatrix[1]?.[0] ?? 0) +
                      (data.holdingMatrix[1]?.[1] ?? 0)
                    }`}
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Relatório Detalhado - Churn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-mono text-xs bg-gray-50 p-4 rounded overflow-x-auto">
                  <pre>
                    {`Classification Report - Churn

              precision    recall  f1-score   support

        Alto       ${formatPercentage(
          data.churnReport.precision.alto,
          2
        )}      ${formatPercentage(
                      data.churnReport.recall.alto,
                      2
                    )}      ${formatPercentage(
                      data.churnReport.f1Score.alto,
                      2
                    )}       ${
                      (data.churnMatrix[0]?.[0] ?? 0) +
                      (data.churnMatrix[0]?.[1] ?? 0) +
                      (data.churnMatrix[0]?.[2] ?? 0)
                    }
       Médio       ${formatPercentage(
         data.churnReport.precision.medio,
         2
       )}      ${formatPercentage(
                      data.churnReport.recall.medio,
                      2
                    )}      ${formatPercentage(
                      data.churnReport.f1Score.medio,
                      2
                    )}      ${
                      (data.churnMatrix[1]?.[0] ?? 0) +
                      (data.churnMatrix[1]?.[1] ?? 0) +
                      (data.churnMatrix[1]?.[2] ?? 0)
                    }
       Baixo       ${formatPercentage(
         data.churnReport.precision.baixo,
         2
       )}      ${formatPercentage(
                      data.churnReport.recall.baixo,
                      2
                    )}      ${formatPercentage(
                      data.churnReport.f1Score.baixo,
                      2
                    )}      ${
                      (data.churnMatrix[2]?.[0] ?? 0) +
                      (data.churnMatrix[2]?.[1] ?? 0) +
                      (data.churnMatrix[2]?.[2] ?? 0)
                    }

    accuracy                           ${formatPercentage(
      data.churnReport.accuracy,
      2
    )}      ${
                      (data.churnMatrix[0]?.[0] ?? 0) +
                      (data.churnMatrix[0]?.[1] ?? 0) +
                      (data.churnMatrix[0]?.[2] ?? 0) +
                      (data.churnMatrix[1]?.[0] ?? 0) +
                      (data.churnMatrix[1]?.[1] ?? 0) +
                      (data.churnMatrix[1]?.[2] ?? 0) +
                      (data.churnMatrix[2]?.[0] ?? 0) +
                      (data.churnMatrix[2]?.[1] ?? 0) +
                      (data.churnMatrix[2]?.[2] ?? 0)
                    }
   macro avg       ${formatPercentage(
     (data.churnReport.precision.alto +
       data.churnReport.precision.medio +
       data.churnReport.precision.baixo) /
       3,
     2
   )}      ${formatPercentage(
                      (data.churnReport.recall.alto +
                        data.churnReport.recall.medio +
                        data.churnReport.recall.baixo) /
                        3,
                      2
                    )}      ${formatPercentage(
                      (data.churnReport.f1Score.alto +
                        data.churnReport.f1Score.medio +
                        data.churnReport.f1Score.baixo) /
                        3,
                      2
                    )}      ${
                      (data.churnMatrix[0]?.[0] ?? 0) +
                      (data.churnMatrix[0]?.[1] ?? 0) +
                      (data.churnMatrix[0]?.[2] ?? 0) +
                      (data.churnMatrix[1]?.[0] ?? 0) +
                      (data.churnMatrix[1]?.[1] ?? 0) +
                      (data.churnMatrix[1]?.[2] ?? 0) +
                      (data.churnMatrix[2]?.[0] ?? 0) +
                      (data.churnMatrix[2]?.[1] ?? 0) +
                      (data.churnMatrix[2]?.[2] ?? 0)
                    }
weighted avg       ${formatPercentage(
                      data.churnReport.accuracy,
                      2
                    )}      ${formatPercentage(
                      data.churnReport.accuracy,
                      2
                    )}      ${formatPercentage(
                      data.churnReport.accuracy,
                      2
                    )}      ${
                      (data.churnMatrix[0]?.[0] ?? 0) +
                      (data.churnMatrix[0]?.[1] ?? 0) +
                      (data.churnMatrix[0]?.[2] ?? 0) +
                      (data.churnMatrix[1]?.[0] ?? 0) +
                      (data.churnMatrix[1]?.[1] ?? 0) +
                      (data.churnMatrix[1]?.[2] ?? 0) +
                      (data.churnMatrix[2]?.[0] ?? 0) +
                      (data.churnMatrix[2]?.[1] ?? 0) +
                      (data.churnMatrix[2]?.[2] ?? 0)
                    }`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
