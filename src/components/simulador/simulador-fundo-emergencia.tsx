"use client";

import { useState } from "react";
import { Calculator, ShieldCheck } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

export function SimuladorFundoEmergencia() {
  const [rendaMensal, setRendaMensal] = useState(10000);
  const [despesasMensais, setDespesasMensais] = useState(7000);
  const [mesesDesejados, setMesesDesejados] = useState(6);
  const [valorAtual, setValorAtual] = useState(15000);
  const [aporteMensal, setAporteMensal] = useState(1000);
  const [taxaRendimento, setTaxaRendimento] = useState(0.8); // % ao mês
  const [resultados, setResultados] = useState<null | {
    valorIdeal: number;
    tempoParaCompletar: number;
    percentualAtingido: number;
    valorFaltante: number;
  }>(null);

  const calcularFundoEmergencia = () => {
    // Valor ideal do fundo de emergência (baseado nas despesas mensais)
    const valorIdeal = despesasMensais * mesesDesejados;

    // Percentual já atingido
    const percentualAtingido = Math.min(100, (valorAtual / valorIdeal) * 100);

    // Valor faltante
    const valorFaltante = Math.max(0, valorIdeal - valorAtual);

    // Tempo para completar o fundo (em meses)
    let tempoParaCompletar = 0;

    if (valorFaltante > 0 && aporteMensal > 0) {
      // Taxa mensal em decimal
      const taxaMensal = taxaRendimento / 100;

      // Cálculo do tempo necessário considerando os rendimentos
      let saldoAcumulado = valorAtual;

      while (saldoAcumulado < valorIdeal) {
        saldoAcumulado = saldoAcumulado * (1 + taxaMensal) + aporteMensal;
        tempoParaCompletar++;

        // Limite de segurança para evitar loop infinito
        if (tempoParaCompletar > 120) {
          break;
        }
      }
    }

    setResultados({
      valorIdeal,
      tempoParaCompletar,
      percentualAtingido,
      valorFaltante,
    });
  };

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="w-full mx-auto space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 lg:gap-8">
        <div className="space-y-2 sm:space-y-3 md:space-y-4">
          {/* Ajustar o espaçamento dos inputs */}
          <div className="space-y-1.5 md:space-y-2">
            <Label
              htmlFor="renda-mensal"
              className="text-xs sm:text-sm md:text-base"
            >
              Renda Mensal
            </Label>
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
              <Input
                id="renda-mensal"
                type="number"
                min={1000}
                value={rendaMensal}
                onChange={(e) => setRendaMensal(Number(e.target.value))}
                className="flex-1 h-8 sm:h-9 md:h-10 text-xs sm:text-sm"
              />
              <span className="text-xs sm:text-sm text-muted-foreground w-14 sm:w-16 md:w-20 truncate">
                {formatarMoeda(rendaMensal)}
              </span>
            </div>
            <Slider
              value={[rendaMensal]}
              min={1000}
              max={50000}
              step={500}
              onValueChange={(value) => setRendaMensal(value[0])}
              className="py-1 md:py-2 mt-1"
            />
          </div>

          <div className="space-y-1 md:space-y-2">
            <Label
              htmlFor="despesas-mensais"
              className="text-xs sm:text-sm md:text-base"
            >
              Despesas Mensais
            </Label>
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
              <Input
                id="despesas-mensais"
                type="number"
                min={500}
                max={rendaMensal}
                value={despesasMensais}
                onChange={(e) => setDespesasMensais(Number(e.target.value))}
                className="flex-1 h-8 sm:h-9 md:h-10 text-xs sm:text-sm"
              />
              <span className="text-xs sm:text-sm text-muted-foreground w-14 sm:w-16 md:w-20 truncate">
                {formatarMoeda(despesasMensais)}
              </span>
            </div>
            <Slider
              value={[despesasMensais]}
              min={500}
              max={rendaMensal}
              step={500}
              onValueChange={(value) => setDespesasMensais(value[0])}
              className="py-1 md:py-2 mt-1"
            />
          </div>

          <div className="space-y-1 md:space-y-2">
            <Label
              htmlFor="meses-desejados"
              className="text-xs sm:text-sm md:text-base"
            >
              Meses de Cobertura Desejados
            </Label>
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
              <Input
                id="meses-desejados"
                type="number"
                min={3}
                max={12}
                value={mesesDesejados}
                onChange={(e) => setMesesDesejados(Number(e.target.value))}
                className="flex-1 h-8 sm:h-9 md:h-10 text-xs sm:text-sm"
              />
              <span className="text-xs sm:text-sm text-muted-foreground w-14 sm:w-16 md:w-20 truncate">
                {mesesDesejados} meses
              </span>
            </div>
            <Slider
              value={[mesesDesejados]}
              min={3}
              max={12}
              step={1}
              onValueChange={(value) => setMesesDesejados(value[0])}
              className="py-1 md:py-2 mt-1"
            />
          </div>

          <div className="space-y-1 md:space-y-2">
            <Label
              htmlFor="valor-atual"
              className="text-xs sm:text-sm md:text-base"
            >
              Valor Atual do Fundo
            </Label>
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
              <Input
                id="valor-atual"
                type="number"
                min={0}
                value={valorAtual}
                onChange={(e) => setValorAtual(Number(e.target.value))}
                className="flex-1 h-8 sm:h-9 md:h-10 text-xs sm:text-sm"
              />
              <span className="text-xs sm:text-sm text-muted-foreground w-14 sm:w-16 md:w-20 truncate">
                {formatarMoeda(valorAtual)}
              </span>
            </div>
            <Slider
              value={[valorAtual]}
              min={0}
              max={despesasMensais * mesesDesejados * 1.5}
              step={1000}
              onValueChange={(value) => setValorAtual(value[0])}
              className="py-1 md:py-2 mt-1"
            />
          </div>

          <div className="space-y-1 md:space-y-2">
            <Label
              htmlFor="aporte-mensal"
              className="text-xs sm:text-sm md:text-base"
            >
              Aporte Mensal
            </Label>
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
              <Input
                id="aporte-mensal"
                type="number"
                min={0}
                value={aporteMensal}
                onChange={(e) => setAporteMensal(Number(e.target.value))}
                className="flex-1 h-8 sm:h-9 md:h-10 text-xs sm:text-sm"
              />
              <span className="text-xs sm:text-sm text-muted-foreground w-14 sm:w-16 md:w-20 truncate">
                {formatarMoeda(aporteMensal)}
              </span>
            </div>
            <Slider
              value={[aporteMensal]}
              min={0}
              max={5000}
              step={100}
              onValueChange={(value) => setAporteMensal(value[0])}
              className="py-1 md:py-2 mt-1"
            />
          </div>

          <div className="space-y-1 md:space-y-2">
            <Label
              htmlFor="taxa-rendimento"
              className="text-xs sm:text-sm md:text-base"
            >
              Taxa de Rendimento Mensal (%)
            </Label>
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
              <Input
                id="taxa-rendimento"
                type="number"
                min={0.1}
                max={2}
                step={0.1}
                value={taxaRendimento}
                onChange={(e) => setTaxaRendimento(Number(e.target.value))}
                className="flex-1 h-8 sm:h-9 md:h-10 text-xs sm:text-sm"
              />
              <span className="text-xs sm:text-sm text-muted-foreground w-14 sm:w-16 md:w-20 truncate">
                {taxaRendimento.toFixed(2)}% a.m.
              </span>
            </div>
            <Slider
              value={[taxaRendimento]}
              min={0.1}
              max={2}
              step={0.1}
              onValueChange={(value) => setTaxaRendimento(value[0])}
              className="py-1 md:py-2 mt-1"
            />
          </div>

          <Button
            onClick={calcularFundoEmergencia}
            className="w-full bg-[#1A2A3A] hover:bg-[#0D1520] py-1.5 sm:py-2 md:py-3 text-xs sm:text-sm md:text-base"
          >
            <Calculator className="mr-1.5 md:mr-2 h-3 w-3 md:h-4 md:w-4" />{" "}
            Calcular Fundo de Emergência
          </Button>
        </div>

        {/* Ajustar o card de resultados para dispositivos móveis */}
        <div>
          {resultados ? (
            <Card className="bg-[#001122]/5 h-full shadow-md border border-[#001122]/10">
              <CardContent className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6">
                <div>
                  <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-4">
                    Resultado da Simulação
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Fundo de emergência para {mesesDesejados} meses de despesas
                  </p>
                </div>

                <div className="space-y-4 md:space-y-6">
                  <div className="space-y-1 md:space-y-2">
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Valor Ideal do Fundo
                    </p>
                    <p className="text-xl md:text-3xl font-bold">
                      {formatarMoeda(resultados.valorIdeal)}
                    </p>
                  </div>

                  <div className="space-y-1 md:space-y-2">
                    <div className="flex justify-between">
                      <p className="text-xs md:text-sm text-muted-foreground">
                        Progresso
                      </p>
                      <p className="text-xs md:text-sm font-medium">
                        {resultados.percentualAtingido.toFixed(1)}%
                      </p>
                    </div>
                    <Progress
                      value={resultados.percentualAtingido}
                      className="h-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <div className="space-y-1 md:space-y-2">
                      <p className="text-xs md:text-sm text-muted-foreground">
                        Valor Atual
                      </p>
                      <p className="text-base md:text-xl font-medium">
                        {formatarMoeda(valorAtual)}
                      </p>
                    </div>

                    <div className="space-y-1 md:space-y-2">
                      <p className="text-xs md:text-sm text-muted-foreground">
                        Valor Faltante
                      </p>
                      <p className="text-base md:text-xl font-medium">
                        {formatarMoeda(resultados.valorFaltante)}
                      </p>
                    </div>
                  </div>

                  {resultados.valorFaltante > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Tempo para Completar
                      </p>
                      <p className="text-2xl font-bold">
                        {resultados.tempoParaCompletar > 120
                          ? "Mais de 10 anos"
                          : `${resultados.tempoParaCompletar} ${
                              resultados.tempoParaCompletar === 1
                                ? "mês"
                                : "meses"
                            }`}
                      </p>
                      {resultados.tempoParaCompletar > 24 && (
                        <p className="text-xs text-amber-500">
                          Considere aumentar seu aporte mensal para atingir sua
                          meta mais rapidamente.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-green-500">
                    <ShieldCheck className="h-5 w-5" />
                    <p className="text-sm font-medium">
                      {resultados.percentualAtingido >= 100
                        ? "Parabéns! Seu fundo de emergência está completo."
                        : `Você já tem ${resultados.percentualAtingido.toFixed(
                            1
                          )}% do seu fundo de emergência ideal.`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center h-full space-y-3 md:space-y-4 p-3 sm:p-4 md:p-6 lg:p-8 border border-dashed rounded-lg border-[#001122]/20">
              <div className="p-2 md:p-3 rounded-full bg-[#1A2A3A]/20">
                <ShieldCheck className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-[#1A2A3A]" />
              </div>
              <div className="text-center">
                <h3 className="text-sm md:text-base lg:text-lg font-medium">
                  Planeje seu fundo de emergência
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  Preencha os campos e clique em calcular para ver os
                  resultados.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#001122]/5 p-3 sm:p-4 md:p-6 rounded-lg shadow-sm border border-[#001122]/10">
        <h3 className="font-medium mb-1 sm:mb-2 text-sm md:text-base">
          Sobre o Fundo de Emergência
        </h3>
        <p className="text-xs md:text-sm text-muted-foreground mb-2 sm:mb-3 md:mb-4">
          Um fundo de emergência é uma reserva financeira destinada a cobrir
          despesas inesperadas ou períodos sem renda. Especialistas recomendam
          ter entre 3 e 12 meses de despesas guardados, dependendo da sua
          estabilidade financeira e profissional.
        </p>

        <h4 className="font-medium mb-2">
          Onde aplicar seu fundo de emergência
        </h4>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li>
            • Conta poupança: Baixo rendimento, mas com liquidez imediata.
          </li>
          <li>
            • CDB com liquidez diária: Melhor rendimento que a poupança e
            resgate rápido.
          </li>
          <li>• Tesouro Selic: Boa opção com segurança e liquidez.</li>
          <li>
            • Fundos DI: Alternativa com boa liquidez e rentabilidade atrelada à
            taxa Selic.
          </li>
          <li>
            • Evite investimentos de risco ou com baixa liquidez para seu fundo
            de emergência.
          </li>
        </ul>
      </div>
    </div>
  );
}
