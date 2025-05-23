"use client";

import { useState } from "react";
import { Calculator, TrendingDown } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SimuladorEmprestimo() {
  const [tipoEmprestimo, setTipoEmprestimo] = useState("pessoal");
  const [valorEmprestimo, setValorEmprestimo] = useState(50000);
  const [prazoMeses, setPrazoMeses] = useState(36);
  const [taxaJuros, setTaxaJuros] = useState(
    tipoEmprestimo === "pessoal"
      ? 2.5
      : tipoEmprestimo === "automovel"
      ? 1.5
      : tipoEmprestimo === "imobiliario"
      ? 0.8
      : 2.5
  );
  const [tipoAmortizacao, setTipoAmortizacao] = useState("price");
  const [resultados, setResultados] = useState<null | {
    valorParcela: number;
    totalJuros: number;
    totalPago: number;
    parcelas: Array<{
      numero: number;
      amortizacao: number;
      juros: number;
      parcela: number;
      saldoDevedor: number;
    }>;
  }>(null);

  // Atualiza a taxa quando o tipo de empréstimo muda
  const handleTipoChange = (value: string) => {
    setTipoEmprestimo(value);

    // Atualiza a taxa de acordo com o tipo de empréstimo
    switch (value) {
      case "pessoal":
        setTaxaJuros(2.5);
        break;
      case "automovel":
        setTaxaJuros(1.5);
        break;
      case "imobiliario":
        setTaxaJuros(0.8);
        break;
      default:
        setTaxaJuros(2.5);
    }
  };

  const calcularEmprestimo = () => {
    // Taxa mensal em decimal
    const taxaMensal = taxaJuros / 100;

    const parcelas = [];
    let valorParcela = 0;
    let totalJuros = 0;
    let totalPago = 0;

    if (tipoAmortizacao === "price") {
      // Sistema Price (parcelas fixas)
      valorParcela =
        (valorEmprestimo *
          (taxaMensal * Math.pow(1 + taxaMensal, prazoMeses))) /
        (Math.pow(1 + taxaMensal, prazoMeses) - 1);

      let saldoDevedor = valorEmprestimo;

      for (let i = 1; i <= prazoMeses; i++) {
        const juros = saldoDevedor * taxaMensal;
        const amortizacao = valorParcela - juros;
        saldoDevedor -= amortizacao;

        parcelas.push({
          numero: i,
          amortizacao,
          juros,
          parcela: valorParcela,
          saldoDevedor: Math.max(0, saldoDevedor),
        });

        totalJuros += juros;
      }

      totalPago = valorParcela * prazoMeses;
    } else {
      // Sistema SAC (amortização constante)
      const amortizacaoConstante = valorEmprestimo / prazoMeses;
      let saldoDevedor = valorEmprestimo;

      for (let i = 1; i <= prazoMeses; i++) {
        const juros = saldoDevedor * taxaMensal;
        const parcela = amortizacaoConstante + juros;
        saldoDevedor -= amortizacaoConstante;

        parcelas.push({
          numero: i,
          amortizacao: amortizacaoConstante,
          juros,
          parcela,
          saldoDevedor: Math.max(0, saldoDevedor),
        });

        totalJuros += juros;
        totalPago += parcela;
      }

      valorParcela = parcelas[0].parcela;
    }

    setResultados({
      valorParcela,
      totalJuros,
      totalPago,
      parcelas,
    });
  };

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="w-full mx-auto space-y-4 md:space-y-6 lg:space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 lg:gap-8">
        <div className="space-y-2 md:space-y-3 lg:space-y-4">
          <div className="space-y-1.5 md:space-y-2">
            <Label htmlFor="tipo-emprestimo" className="text-sm md:text-base">
              Tipo de Empréstimo/Financiamento
            </Label>
            <Select value={tipoEmprestimo} onValueChange={handleTipoChange}>
              <SelectTrigger id="tipo-emprestimo" className="h-9 md:h-10">
                <SelectValue placeholder="Selecione o tipo de empréstimo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pessoal">Empréstimo Pessoal</SelectItem>
                <SelectItem value="automovel">
                  Financiamento de Automóvel
                </SelectItem>
                <SelectItem value="imobiliario">
                  Financiamento Imobiliário
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="valor-emprestimo">Valor do Empréstimo</Label>
            <div className="flex items-center space-x-4">
              <Input
                id="valor-emprestimo"
                type="number"
                min={1000}
                value={valorEmprestimo}
                onChange={(e) => setValorEmprestimo(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground w-24">
                {formatarMoeda(valorEmprestimo)}
              </span>
            </div>
            <Slider
              value={[valorEmprestimo]}
              min={1000}
              max={tipoEmprestimo === "imobiliario" ? 1000000 : 200000}
              step={1000}
              onValueChange={(value) => setValorEmprestimo(value[0])}
              className="py-2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prazo-meses">Prazo (meses)</Label>
            <div className="flex items-center space-x-4">
              <Input
                id="prazo-meses"
                type="number"
                min={1}
                max={tipoEmprestimo === "imobiliario" ? 420 : 120}
                value={prazoMeses}
                onChange={(e) => setPrazoMeses(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground w-24">
                {prazoMeses} meses
              </span>
            </div>
            <Slider
              value={[prazoMeses]}
              min={1}
              max={tipoEmprestimo === "imobiliario" ? 420 : 120}
              step={1}
              onValueChange={(value) => setPrazoMeses(value[0])}
              className="py-2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxa-juros">Taxa de Juros (% ao mês)</Label>
            <div className="flex items-center space-x-4">
              <Input
                id="taxa-juros"
                type="number"
                min={0.1}
                max={5}
                step={0.1}
                value={taxaJuros}
                onChange={(e) => setTaxaJuros(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground w-24">
                {taxaJuros.toFixed(2)}% a.m.
              </span>
            </div>
            <Slider
              value={[taxaJuros]}
              min={0.1}
              max={5}
              step={0.1}
              onValueChange={(value) => setTaxaJuros(value[0])}
              className="py-2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo-amortizacao">Sistema de Amortização</Label>
            <Select value={tipoAmortizacao} onValueChange={setTipoAmortizacao}>
              <SelectTrigger id="tipo-amortizacao">
                <SelectValue placeholder="Selecione o sistema de amortização" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Price (Parcelas Fixas)</SelectItem>
                <SelectItem value="sac">SAC (Amortização Constante)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              {tipoAmortizacao === "price"
                ? "Sistema Price: Parcelas fixas ao longo de todo o financiamento."
                : "Sistema SAC: Amortização constante, parcelas decrescentes ao longo do tempo."}
            </p>
          </div>

          <Button
            onClick={calcularEmprestimo}
            className="w-full bg-[#1A2A3A] hover:bg-[#0D1520]"
          >
            <Calculator className="mr-2 h-4 w-4" /> Calcular Empréstimo
          </Button>
        </div>

        <div>
          {resultados ? (
            <Card className="bg-[#001122]/5 h-full shadow-md border border-[#001122]/10">
              <CardContent className="p-3 md:p-5 lg:p-6 space-y-3 md:space-y-5 lg:space-y-6">
                <div>
                  <h3 className="text-base md:text-lg lg:text-xl font-bold mb-2 md:mb-4">
                    Resultado da Simulação
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {tipoEmprestimo === "pessoal"
                      ? "Empréstimo Pessoal"
                      : tipoEmprestimo === "automovel"
                      ? "Financiamento de Automóvel"
                      : "Financiamento Imobiliário"}{" "}
                    - Sistema {tipoAmortizacao === "price" ? "Price" : "SAC"}
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {tipoAmortizacao === "price"
                        ? "Valor da Parcela"
                        : "Valor da 1ª Parcela"}
                    </p>
                    <p className="text-3xl font-bold">
                      {formatarMoeda(resultados.valorParcela)}
                    </p>
                    {tipoAmortizacao === "sac" && (
                      <p className="text-xs text-muted-foreground">
                        Última parcela:{" "}
                        {formatarMoeda(
                          resultados.parcelas[resultados.parcelas.length - 1]
                            .parcela
                        )}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Valor Financiado
                      </p>
                      <p className="text-xl font-medium">
                        {formatarMoeda(valorEmprestimo)}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Total de Juros
                      </p>
                      <p className="text-xl font-medium text-red-500">
                        {formatarMoeda(resultados.totalJuros)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Valor Total a Pagar
                    </p>
                    <p className="text-2xl font-bold">
                      {formatarMoeda(resultados.totalPago)}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-amber-500">
                    <TrendingDown className="h-5 w-5" />
                    <p className="text-sm font-medium">
                      {(
                        (resultados.totalJuros / valorEmprestimo) *
                        100
                      ).toFixed(2)}
                      % do valor financiado será pago em juros.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center h-full space-y-4 p-8 border border-dashed rounded-lg">
              <div className="p-3 rounded-full bg-[#1A2A3A]/20">
                <Calculator className="h-10 w-10 text-[#1A2A3A]" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium">Simule seu empréstimo</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Preencha os campos ao lado e clique em calcular para ver os
                  resultados.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {resultados && (
        <Tabs
          defaultValue="resumo"
          className="space-y-3 md:space-y-4 lg:space-y-6"
        >
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger
              value="resumo"
              className="text-xs md:text-sm lg:text-base py-1.5 md:py-2"
            >
              Resumo
            </TabsTrigger>
            <TabsTrigger
              value="parcelas"
              className="text-xs md:text-sm lg:text-base py-1.5 md:py-2"
            >
              Parcelas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resumo">
            <Card>
              <CardContent className="p-4 md:p-6">
                <h3 className="text-base md:text-lg font-medium mb-4 md:mb-6">
                  Composição do Financiamento
                </h3>

                <div className="space-y-6">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-blue-500 h-4 rounded-l-full"
                      style={{
                        width: `${(
                          (valorEmprestimo / resultados.totalPago) *
                          100
                        ).toFixed(2)}%`,
                      }}
                    ></div>
                  </div>

                  <div className="flex justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                        <span className="text-sm">Principal</span>
                      </div>
                      <p className="text-lg font-medium">
                        {formatarMoeda(valorEmprestimo)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(
                          (valorEmprestimo / resultados.totalPago) *
                          100
                        ).toFixed(2)}
                        % do total
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        <span className="text-sm">Juros</span>
                      </div>
                      <p className="text-lg font-medium">
                        {formatarMoeda(resultados.totalJuros)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(
                          (resultados.totalJuros / resultados.totalPago) *
                          100
                        ).toFixed(2)}
                        % do total
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t">
                  <h4 className="font-medium mb-2">Informações Importantes</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>
                      • Taxa de juros efetiva anual:{" "}
                      {((Math.pow(1 + taxaJuros / 100, 12) - 1) * 100).toFixed(
                        2
                      )}
                      % a.a.
                    </li>
                    <li>
                      • CET (Custo Efetivo Total) não inclui tarifas, seguros e
                      outros encargos.
                    </li>
                    <li>• Esta simulação é apenas para fins informativos.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="parcelas">
            <Card>
              <CardContent className="p-4 md:p-6">
                <h3 className="text-base md:text-lg font-medium mb-3 md:mb-4">
                  Tabela de Parcelas
                </h3>

                <div className="overflow-x-auto -mx-3 px-3 md:-mx-5 md:px-5 lg:-mx-6 lg:px-6">
                  <table className="w-full text-[10px] sm:text-xs md:text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-1 md:py-1.5 lg:py-2 font-medium">
                          Parcela
                        </th>
                        <th className="text-right py-1 md:py-1.5 lg:py-2 font-medium">
                          Amortização
                        </th>
                        <th className="text-right py-1 md:py-1.5 lg:py-2 font-medium">
                          Juros
                        </th>
                        <th className="text-right py-1 md:py-1.5 lg:py-2 font-medium">
                          Valor
                        </th>
                        <th className="text-right py-1 md:py-1.5 lg:py-2 font-medium">
                          Saldo
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultados.parcelas.slice(0, 12).map((parcela) => (
                        <tr
                          key={parcela.numero}
                          className="border-b border-gray-100"
                        >
                          <td className="py-2">{parcela.numero}</td>
                          <td className="text-right py-2">
                            {formatarMoeda(parcela.amortizacao)}
                          </td>
                          <td className="text-right py-2 text-red-500">
                            {formatarMoeda(parcela.juros)}
                          </td>
                          <td className="text-right py-2 font-medium">
                            {formatarMoeda(parcela.parcela)}
                          </td>
                          <td className="text-right py-2">
                            {formatarMoeda(parcela.saldoDevedor)}
                          </td>
                        </tr>
                      ))}
                      {prazoMeses > 12 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="text-center py-2 text-muted-foreground"
                          >
                            ... mais {prazoMeses - 12} parcelas
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      <div className="bg-[#001122]/5 p-3 md:p-4 lg:p-6 rounded-lg shadow-sm border border-[#001122]/10">
        <h3 className="font-medium mb-2">
          Dicas para Empréstimos e Financiamentos
        </h3>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li>
            • Compare as taxas de juros entre diferentes instituições
            financeiras.
          </li>
          <li>
            • Avalie se o sistema Price ou SAC é mais adequado para seu perfil
            financeiro.
          </li>
          <li>
            • Considere dar uma entrada maior para reduzir o valor financiado e
            os juros totais.
          </li>
          <li>
            • Verifique a possibilidade de amortização ou quitação antecipada.
          </li>
          <li>
            • Analise o impacto da parcela em seu orçamento mensal antes de
            contratar.
          </li>
        </ul>
      </div>
    </div>
  );
}
