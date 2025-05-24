"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PredictionResponse {
  abriu_holding: string;
  risco_churn: string;
  probabilidades: {
    holding_sim: number;
    holding_nao: number;
    churn_medio: number;
    churn_baixo: number;
  };
  feature_importance: Array<{ feature: string; importance: number }>;
}

export default function PredictionForm() {
  const [formData, setFormData] = useState({
    idade: "",
    volume_investimentos: "",
    qtd_servicos_contratados: "",
    score_relacionamento: "",
    perfil_risco: "",
  });
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}predict/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Idade: Number(formData.idade),
            Volume_Investimentos: Number(formData.volume_investimentos),
            Qtd_Servicos_Contratados: Number(formData.qtd_servicos_contratados),
            Score_Relacionamento: Number(formData.score_relacionamento),
            Perfil_Risco: formData.perfil_risco,
          }),
        }
      );
      if (!response.ok) throw new Error("Erro na predição");
      const data: PredictionResponse = await response.json();
      setPrediction(data);
    } catch (error) {
      console.error("Erro ao realizar predição:", error);
      alert("Erro ao realizar predição. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova Previsão</CardTitle>
        <CardDescription>
          Insira os dados do cliente para prever holding e risco de churn
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="idade">Idade</Label>
            <Input
              id="idade"
              type="number"
              value={formData.idade}
              onChange={(e) =>
                setFormData({ ...formData, idade: e.target.value })
              }
              required
              min="18"
              max="120"
            />
          </div>
          <div>
            <Label htmlFor="volume_investimentos">
              Volume de Investimentos (R$)
            </Label>
            <Input
              id="volume_investimentos"
              type="number"
              value={formData.volume_investimentos}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  volume_investimentos: e.target.value,
                })
              }
              required
              min="0"
            />
          </div>
          <div>
            <Label htmlFor="qtd_servicos_contratados">
              Quantidade de Serviços Contratados
            </Label>
            <Input
              id="qtd_servicos_contratados"
              type="number"
              value={formData.qtd_servicos_contratados}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  qtd_servicos_contratados: e.target.value,
                })
              }
              required
              min="0"
              max="50"
            />
          </div>
          <div>
            <Label htmlFor="score_relacionamento">
              Score de Relacionamento (0-100)
            </Label>
            <Input
              id="score_relacionamento"
              type="number"
              value={formData.score_relacionamento}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  score_relacionamento: e.target.value,
                })
              }
              required
              min="0"
              max="100"
            />
          </div>
          <div>
            <Label htmlFor="perfil_risco">Perfil de Risco</Label>
            <Select
              value={formData.perfil_risco}
              onValueChange={(value) =>
                setFormData({ ...formData, perfil_risco: value })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o perfil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Conservador">Conservador</SelectItem>
                <SelectItem value="Moderado">Moderado</SelectItem>
                <SelectItem value="Agressivo">Agressivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Processando..." : "Realizar Previsão"}
          </Button>
        </form>

        {prediction && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">Resultados da Previsão</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Previsão de Holding</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Abertura de Holding:{" "}
                    <strong>{prediction.abriu_holding}</strong>
                  </p>
                  <p className="text-sm">
                    Prob. Sim:{" "}
                    {prediction.probabilidades.holding_sim.toFixed(1)}%
                  </p>
                  <p className="text-sm">
                    Prob. Não:{" "}
                    {prediction.probabilidades.holding_nao.toFixed(1)}%
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Risco de Churn</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Risco: <strong>{prediction.risco_churn}</strong>
                  </p>
                  <p className="text-sm">
                    Prob. Médio:{" "}
                    {prediction.probabilidades.churn_medio.toFixed(1)}%
                  </p>
                  <p className="text-sm">
                    Prob. Baixo:{" "}
                    {prediction.probabilidades.churn_baixo.toFixed(1)}%
                  </p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Importância das Features</CardTitle>
              </CardHeader>
              <CardContent>
                {prediction.feature_importance.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.feature.replace("_", " ")}</span>
                    <span>{(item.importance * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
