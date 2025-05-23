"use client";

import { useState } from "react";
import { Calculator } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function SimuladorRendaFixa() {
  const [tipoInvestimento, setTipoInvestimento] = useState("cdb");
  const [valorInicial, setValorInicial] = useState(5000);
  const [prazo, setPrazo] = useState(24); // meses
  const [taxaAnual, setTaxaAnual] = useState(
    tipoInvestimento === "cdb"
      ? 12.5
      : tipoInvestimento === "lci"
      ? 11.0
      : tipoInvestimento === "lca"
      ? 11.2
      : tipoInvestimento === "tesouro"
      ? 10.8
      : 12.5
  );
  const [resultados, setResultados] = useState<null | {
    valorFinal: number;
    rendimentoBruto: number;
    rendimentoLiquido: number;
    ir: number;
  }>(null);

  // Atualiza a taxa quando o tipo de investimento muda
  const handleTipoChange = (value: string) => {
    setTipoInvestimento(value);

    // Atualiza a taxa de acordo com o tipo de investimento
    switch (value) {
      case "cdb":
        setTaxaAnual(12.5);
        break;
      case "lci":
        setTaxaAnual(11.0);
        break;
      case "lca":
        setTaxaAnual(11.2);
        break;
      case "tesouro":
        setTaxaAnual(10.8);
        break;
      default:
        setTaxaAnual(12.5);
    }
  };

  const calcularRendimento = () => {
    // Taxa mensal equivalente
    const taxaMensal = Math.pow(1 + taxaAnual / 100, 1 / 12) - 1;

    // Valor final
    const valorFinal = valorInicial * Math.pow(1 + taxaMensal, prazo);

    // Rendimento bruto
    const rendimentoBruto = valorFinal - valorInicial;

    // Cálculo do IR (apenas para CDB e Tesouro)
    let aliquotaIR = 0;
    if (tipoInvestimento === "cdb" || tipoInvestimento === "tesouro") {
      if (prazo <= 6) {
        aliquotaIR = 0.225; // 22.5%
      } else if (prazo <= 12) {
        aliquotaIR = 0.2; // 20%
      } else if (prazo <= 24) {
        aliquotaIR = 0.175; // 17.5%
      } else {
        aliquotaIR = 0.15; // 15%
      }
    }

    const ir = rendimentoBruto * aliquotaIR;
    const rendimentoLiquido = rendimentoBruto - ir;

    setResultados({
      valorFinal,
      rendimentoBruto,
      rendimentoLiquido,
      ir,
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
            <Label
              htmlFor="tipo-investimento"
              className="text-[#001122] text-xs sm:text-sm md:text-base font-medium"
            >
              Tipo de Investimento
            </Label>
            <Select value={tipoInvestimento} onValueChange={handleTipoChange}>
              <SelectTrigger
                id="tipo-investimento"
                className="border-[#001122]/20 focus:ring-[#1A2A3A] h-8 sm:h-9 md:h-10"
              >
                <SelectValue placeholder="Selecione o tipo de investimento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cdb">CDB</SelectItem>
                <SelectItem value="lci">LCI</SelectItem>
                <SelectItem value="lca">LCA</SelectItem>
                <SelectItem value="tesouro">Tesouro Direto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Ajustar os outros inputs de forma similar */}
          <div className="space-y-1.5 md:space-y-2">
            <Label
              htmlFor="valor-inicial"
              className="text-[#001122] text-xs sm:text-sm md:text-base font-medium"
            >
              Valor Inicial
            </Label>
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
              <Input
                id="valor-inicial"
                type="number"
                min={100}
                value={valorInicial}
                onChange={(e) => setValorInicial(Number(e.target.value))}
                className="flex-1 border-[#001122]/20 focus:ring-[#1A2A3A] h-9 md:h-10"
              />
              <span className="text-xs md:text-sm text-muted-foreground w-20">
                {formatarMoeda(valorInicial)}
              </span>
            </div>
            <Slider
              value={[valorInicial]}
              min={1000}
              max={100000}
              step={1000}
              onValueChange={(value) => setValorInicial(value[0])}
              className="py-2 md:py-4"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="prazo"
              className="text-[#001122] text-xs sm:text-sm md:text-base font-medium"
            >
              Prazo (meses)
            </Label>
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
              <Input
                id="prazo"
                type="number"
                min={1}
                max={120}
                value={prazo}
                onChange={(e) => setPrazo(Number(e.target.value))}
                className="flex-1 border-[#001122]/20 focus:ring-[#1A2A3A]"
              />
              <span className="text-sm text-muted-foreground w-20">
                {prazo} meses
              </span>
            </div>
            <Slider
              value={[prazo]}
              min={1}
              max={120}
              step={1}
              onValueChange={(value) => setPrazo(value[0])}
              className="py-4"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="taxa-anual"
              className="text-[#001122] text-xs sm:text-sm md:text-base font-medium"
            >
              Taxa de Juros (% ao ano)
            </Label>
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
              <Input
                id="taxa-anual"
                type="number"
                min={0.1}
                max={20}
                step={0.1}
                value={taxaAnual}
                onChange={(e) => setTaxaAnual(Number(e.target.value))}
                className="flex-1 border-[#001122]/20 focus:ring-[#1A2A3A]"
              />
              <span className="text-sm text-muted-foreground w-20">
                {taxaAnual.toFixed(2)}% a.a.
              </span>
            </div>
            <Slider
              value={[taxaAnual]}
              min={1}
              max={20}
              step={0.1}
              onValueChange={(value) => setTaxaAnual(value[0])}
              className="py-4"
            />
          </div>

          <Button
            onClick={calcularRendimento}
            className="w-full bg-[#1A2A3A] hover:bg-[#0D1520] text-white font-medium py-2.5"
          >
            <Calculator className="mr-2 h-4 w-4" /> Calcular Rendimento
          </Button>
        </div>

        <div>
          {resultados ? (
            <Card className="bg-[#001122]/5 border-[#001122]/10 h-full shadow-md">
              <CardHeader className="pb-1 md:pb-2 pt-3 md:pt-4 px-3 md:px-5 lg:px-6">
                <CardTitle className="text-base md:text-lg lg:text-xl text-[#001122]">
                  Resultado da Simulação
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Investimento em {tipoInvestimento.toUpperCase()} por {prazo}{" "}
                  meses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4 lg:space-y-6 pt-0 px-3 md:px-5 lg:px-6">
                <div className="space-y-1 md:space-y-2">
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Valor Investido
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-[#001122]">
                    {formatarMoeda(valorInicial)}
                  </p>
                </div>

                <div className="space-y-1 md:space-y-2">
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Valor Bruto Final
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-[#001122]">
                    {formatarMoeda(resultados.valorFinal)}
                  </p>
                </div>

                <div className="space-y-1 md:space-y-2">
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Rendimento Bruto
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-green-600">
                    {formatarMoeda(resultados.rendimentoBruto)}
                  </p>
                </div>

                {(tipoInvestimento === "cdb" ||
                  tipoInvestimento === "tesouro") && (
                  <div className="space-y-1 md:space-y-2">
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Imposto de Renda
                    </p>
                    <p className="text-lg md:text-xl font-bold text-red-500">
                      {formatarMoeda(resultados.ir)}
                    </p>
                  </div>
                )}

                <div className="space-y-1 md:space-y-2">
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Rendimento Líquido
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-green-600">
                    {formatarMoeda(resultados.rendimentoLiquido)}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground">
                  {tipoInvestimento === "lci" || tipoInvestimento === "lca"
                    ? "LCI e LCA são isentos de Imposto de Renda para pessoa física."
                    : "Alíquota de IR aplicada conforme prazo de investimento."}
                </p>
              </CardFooter>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center h-full space-y-3 md:space-y-4 p-4 md:p-6 lg:p-8 border border-dashed rounded-lg border-[#001122]/20">
              <div className="p-2 md:p-3 rounded-full bg-[#1A2A3A]/20">
                <Calculator className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-[#1A2A3A]" />
              </div>
              <div className="text-center">
                <h3 className="text-sm md:text-base lg:text-lg font-medium text-[#001122]">
                  Simule seu investimento
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

      <div className="bg-[#001122]/5 p-3 md:p-4 lg:p-6 rounded-lg border border-[#001122]/10 shadow-sm">
        <h3 className="font-medium mb-1 md:mb-2 text-[#001122] text-sm md:text-base">
          Sobre {tipoInvestimento.toUpperCase()}
        </h3>
        <p className="text-xs md:text-sm text-muted-foreground">
          {tipoInvestimento === "cdb" && (
            <>
              O Certificado de Depósito Bancário (CDB) é um título de renda fixa
              emitido por bancos como forma de captação de recursos. O
              rendimento é tributado pelo Imposto de Renda, com alíquotas
              regressivas conforme o prazo de aplicação.
            </>
          )}
          {tipoInvestimento === "lci" && (
            <>
              A Letra de Crédito Imobiliário (LCI) é um título de renda fixa
              emitido por instituições financeiras para financiar o setor
              imobiliário. É isenta de Imposto de Renda para pessoas físicas e
              conta com a garantia do FGC até R$ 250 mil.
            </>
          )}
          {tipoInvestimento === "lca" && (
            <>
              A Letra de Crédito do Agronegócio (LCA) é um título de renda fixa
              emitido por instituições financeiras para financiar o setor
              agrícola. É isenta de Imposto de Renda para pessoas físicas e
              conta com a garantia do FGC até R$ 250 mil.
            </>
          )}
          {tipoInvestimento === "tesouro" && (
            <>
              O Tesouro Direto é um programa do Governo Federal que permite a
              compra de títulos públicos por pessoas físicas. Oferece segurança,
              liquidez e rentabilidade, mas está sujeito ao Imposto de Renda com
              alíquotas regressivas.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
