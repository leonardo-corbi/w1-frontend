"use client";

import { useState } from "react";
import { Calculator } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function SimuladorAposentadoria() {
  const [idadeAtual, setIdadeAtual] = useState(30);
  const [idadeAposentadoria, setIdadeAposentadoria] = useState(65);
  const [rendaMensal, setRendaMensal] = useState(10000);
  const [patrimonioAtual, setPatrimonioAtual] = useState(50000);
  const [contribuicaoMensal, setContribuicaoMensal] = useState(1000);
  const [taxaJuros, setTaxaJuros] = useState(6); // % ao ano
  const [resultados, setResultados] = useState<null | {
    patrimonioFinal: number;
    rendaMensalEstimada: number;
    contribuicaoTotal: number;
    rendimentoTotal: number;
  }>(null);

  const calcularAposentadoria = () => {
    // Anos até a aposentadoria
    const anosContribuicao = idadeAposentadoria - idadeAtual;

    // Taxa mensal equivalente
    const taxaMensal = Math.pow(1 + taxaJuros / 100, 1 / 12) - 1;

    // Número de meses de contribuição
    const mesesContribuicao = anosContribuicao * 12;

    // Cálculo do patrimônio final
    let patrimonioFinal =
      patrimonioAtual * Math.pow(1 + taxaMensal, mesesContribuicao);

    // Cálculo das contribuições mensais capitalizadas
    for (let i = 0; i < mesesContribuicao; i++) {
      patrimonioFinal +=
        contribuicaoMensal * Math.pow(1 + taxaMensal, mesesContribuicao - i);
    }

    // Contribuição total
    const contribuicaoTotal =
      contribuicaoMensal * mesesContribuicao + patrimonioAtual;

    // Rendimento total
    const rendimentoTotal = patrimonioFinal - contribuicaoTotal;

    // Renda mensal estimada (considerando 0.4% ao mês de retirada)
    const rendaMensalEstimada = patrimonioFinal * 0.004;

    setResultados({
      patrimonioFinal,
      rendaMensalEstimada,
      contribuicaoTotal,
      rendimentoTotal,
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-3">
            <div className="space-y-1.5 md:space-y-2">
              <Label
                htmlFor="idade-atual"
                className="text-xs sm:text-sm md:text-base"
              >
                Idade Atual
              </Label>
              <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
                <Input
                  id="idade-atual"
                  type="number"
                  min={18}
                  max={70}
                  value={idadeAtual}
                  onChange={(e) => setIdadeAtual(Number(e.target.value))}
                  className="flex-1 h-8 sm:h-9 md:h-10 text-xs sm:text-sm"
                />
                <span className="text-xs sm:text-sm text-muted-foreground w-8 sm:w-10 md:w-12">
                  anos
                </span>
              </div>
              <Slider
                value={[idadeAtual]}
                min={18}
                max={70}
                step={1}
                onValueChange={(value) => setIdadeAtual(value[0])}
                className="py-1 md:py-2 mt-1"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="idade-aposentadoria"
                className="text-xs sm:text-sm md:text-base"
              >
                Idade de Aposentadoria
              </Label>
              <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
                <Input
                  id="idade-aposentadoria"
                  type="number"
                  min={idadeAtual + 1}
                  max={100}
                  value={idadeAposentadoria}
                  onChange={(e) =>
                    setIdadeAposentadoria(Number(e.target.value))
                  }
                  className="flex-1 h-8 sm:h-9 md:h-10 text-xs sm:text-sm"
                />
                <span className="text-xs sm:text-sm text-muted-foreground w-8 sm:w-10 md:w-12">
                  anos
                </span>
              </div>
              <Slider
                value={[idadeAposentadoria]}
                min={idadeAtual + 1}
                max={100}
                step={1}
                onValueChange={(value) => setIdadeAposentadoria(value[0])}
                className="py-1 md:py-2 mt-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="renda-mensal"
              className="text-xs sm:text-sm md:text-base"
            >
              Renda Mensal Desejada na Aposentadoria
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
              <span className="text-xs sm:text-sm text-muted-foreground w-16 sm:w-18 md:w-20">
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

          <div className="space-y-2">
            <Label
              htmlFor="patrimonio-atual"
              className="text-xs sm:text-sm md:text-base"
            >
              Patrimônio Atual
            </Label>
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
              <Input
                id="patrimonio-atual"
                type="number"
                min={0}
                value={patrimonioAtual}
                onChange={(e) => setPatrimonioAtual(Number(e.target.value))}
                className="flex-1 h-8 sm:h-9 md:h-10 text-xs sm:text-sm"
              />
              <span className="text-xs sm:text-sm text-muted-foreground w-16 sm:w-18 md:w-20">
                {formatarMoeda(patrimonioAtual)}
              </span>
            </div>
            <Slider
              value={[patrimonioAtual]}
              min={0}
              max={1000000}
              step={10000}
              onValueChange={(value) => setPatrimonioAtual(value[0])}
              className="py-1 md:py-2 mt-1"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="contribuicao-mensal"
              className="text-xs sm:text-sm md:text-base"
            >
              Contribuição Mensal
            </Label>
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
              <Input
                id="contribuicao-mensal"
                type="number"
                min={100}
                value={contribuicaoMensal}
                onChange={(e) => setContribuicaoMensal(Number(e.target.value))}
                className="flex-1 h-8 sm:h-9 md:h-10 text-xs sm:text-sm"
              />
              <span className="text-xs sm:text-sm text-muted-foreground w-16 sm:w-18 md:w-20">
                {formatarMoeda(contribuicaoMensal)}
              </span>
            </div>
            <Slider
              value={[contribuicaoMensal]}
              min={100}
              max={10000}
              step={100}
              onValueChange={(value) => setContribuicaoMensal(value[0])}
              className="py-1 md:py-2 mt-1"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="taxa-juros"
              className="text-xs sm:text-sm md:text-base"
            >
              Taxa de Juros Anual (%)
            </Label>
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
              <Input
                id="taxa-juros"
                type="number"
                min={1}
                max={15}
                step={0.5}
                value={taxaJuros}
                onChange={(e) => setTaxaJuros(Number(e.target.value))}
                className="flex-1 h-8 sm:h-9 md:h-10 text-xs sm:text-sm"
              />
              <span className="text-xs sm:text-sm text-muted-foreground w-16 sm:w-18 md:w-20">
                {taxaJuros.toFixed(1)}% a.a.
              </span>
            </div>
            <Slider
              value={[taxaJuros]}
              min={1}
              max={15}
              step={0.5}
              onValueChange={(value) => setTaxaJuros(value[0])}
              className="py-1 md:py-2 mt-1"
            />
          </div>

          <Button
            onClick={calcularAposentadoria}
            className="w-full bg-[#1A2A3A] hover:bg-[#0D1520] py-1.5 sm:py-2 md:py-3 text-xs sm:text-sm md:text-base"
          >
            <Calculator className="mr-1.5 md:mr-2 h-3 w-3 md:h-4 md:w-4" />{" "}
            Calcular Aposentadoria
          </Button>
        </div>

        <div>
          {resultados ? (
            <Card className="bg-[#001122]/5 h-full shadow-md border border-[#001122]/10">
              <CardContent className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6">
                <div>
                  <h3 className="text-base md:text-lg lg:text-xl font-bold mb-1 sm:mb-2 md:mb-4">
                    Resultado da Simulação
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground mb-2 sm:mb-3 md:mb-6">
                    Tempo de contribuição: {idadeAposentadoria - idadeAtual}{" "}
                    anos ({(idadeAposentadoria - idadeAtual) * 12} meses)
                  </p>
                </div>

                <div className="space-y-4 md:space-y-6">
                  <div className="space-y-1 md:space-y-2">
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Patrimônio Estimado na Aposentadoria
                    </p>
                    <p className="text-xl md:text-3xl font-bold">
                      {formatarMoeda(resultados.patrimonioFinal)}
                    </p>
                  </div>

                  <div className="space-y-1 md:space-y-2">
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Renda Mensal Estimada
                    </p>
                    <p className="text-xl md:text-3xl font-bold text-green-500">
                      {formatarMoeda(resultados.rendaMensalEstimada)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Considerando retirada mensal de 0,4% do patrimônio total
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <div className="space-y-1 md:space-y-2">
                      <p className="text-xs md:text-sm text-muted-foreground">
                        Total Investido
                      </p>
                      <p className="text-base md:text-xl font-medium">
                        {formatarMoeda(resultados.contribuicaoTotal)}
                      </p>
                    </div>

                    <div className="space-y-1 md:space-y-2">
                      <p className="text-xs md:text-sm text-muted-foreground">
                        Rendimento Total
                      </p>
                      <p className="text-base md:text-xl font-medium text-green-500">
                        {formatarMoeda(resultados.rendimentoTotal)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center h-full space-y-3 md:space-y-4 p-3 sm:p-4 md:p-6 lg:p-8 border border-dashed rounded-lg border-[#001122]/20">
              <div className="p-2 md:p-3 rounded-full bg-[#1A2A3A]/20">
                <Calculator className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-[#1A2A3A]" />
              </div>
              <div className="text-center">
                <h3 className="text-sm md:text-base lg:text-lg font-medium">
                  Planeje sua aposentadoria
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
          Dicas para Planejamento de Aposentadoria
        </h3>
        <ul className="text-xs md:text-sm text-muted-foreground space-y-1 sm:space-y-2">
          <li>
            • Comece a poupar o quanto antes: o tempo é seu maior aliado devido
            aos juros compostos.
          </li>
          <li>
            • Diversifique seus investimentos entre renda fixa e variável
            conforme seu perfil de risco.
          </li>
          <li>
            • Considere a inflação em seus cálculos para manter seu poder de
            compra no futuro.
          </li>
          <li>
            • Revise seu plano de aposentadoria periodicamente e ajuste conforme
            necessário.
          </li>
          <li>
            • Consulte um especialista financeiro para orientação personalizada.
          </li>
        </ul>
      </div>
    </div>
  );
}
