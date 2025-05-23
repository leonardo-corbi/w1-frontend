"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calculator, PieChart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SimuladorCarteira() {
  const [valorInicial, setValorInicial] = useState(100000);
  const [prazoAnos, setPrazoAnos] = useState(10);
  const [aporteMensal, setAporteMensal] = useState(1000);

  // Alocação de ativos (em %)
  const [rendaFixa, setRendaFixa] = useState(40);
  const [acoes, setAcoes] = useState(30);
  const [fundosImobiliarios, setFundosImobiliarios] = useState(20);
  const [internacional, setInternacional] = useState(10);

  // Rentabilidades esperadas (% ao ano)
  const [rendaFixaRent, setRendaFixaRent] = useState(10);
  const [acoesRent, setAcoesRent] = useState(15);
  const [fundosImobiliariosRent, setFundosImobiliariosRent] = useState(12);
  const [internacionalRent, setInternacionalRent] = useState(18);

  const [resultados, setResultados] = useState<null | {
    valorFinal: number;
    rendimentoTotal: number;
    rentabilidadeMedia: number;
    valorPorClasse: {
      rendaFixa: number;
      acoes: number;
      fundosImobiliarios: number;
      internacional: number;
    };
  }>(null);

  // Ajusta os valores para garantir que somem 100%
  const ajustarAlocacao = (
    novoRendaFixa: number,
    novoAcoes: number,
    novoFundosImobiliarios: number,
    novoInternacional: number
  ) => {
    const total =
      novoRendaFixa + novoAcoes + novoFundosImobiliarios + novoInternacional;

    if (total !== 100) {
      const fator = 100 / total;
      setRendaFixa(Math.round(novoRendaFixa * fator));
      setAcoes(Math.round(novoAcoes * fator));
      setFundosImobiliarios(Math.round(novoFundosImobiliarios * fator));
      setInternacional(Math.round(novoInternacional * fator));
    } else {
      setRendaFixa(novoRendaFixa);
      setAcoes(novoAcoes);
      setFundosImobiliarios(novoFundosImobiliarios);
      setInternacional(novoInternacional);
    }
  };

  const handleRendaFixaChange = (value: number) => {
    ajustarAlocacao(value, acoes, fundosImobiliarios, internacional);
  };

  const handleAcoesChange = (value: number) => {
    ajustarAlocacao(rendaFixa, value, fundosImobiliarios, internacional);
  };

  const handleFundosImobiliariosChange = (value: number) => {
    ajustarAlocacao(rendaFixa, acoes, value, internacional);
  };

  const handleInternacionalChange = (value: number) => {
    ajustarAlocacao(rendaFixa, acoes, fundosImobiliarios, value);
  };

  const calcularCarteira = () => {
    // Rentabilidade média ponderada (anual)
    const rentabilidadeMedia =
      (rendaFixa / 100) * rendaFixaRent +
      (acoes / 100) * acoesRent +
      (fundosImobiliarios / 100) * fundosImobiliariosRent +
      (internacional / 100) * internacionalRent;

    // Taxa mensal equivalente
    const taxaMensal = Math.pow(1 + rentabilidadeMedia / 100, 1 / 12) - 1;

    // Número de meses
    const meses = prazoAnos * 12;

    // Cálculo do valor final
    let valorFinal = valorInicial * Math.pow(1 + taxaMensal, meses);

    // Cálculo dos aportes mensais capitalizados
    for (let i = 0; i < meses; i++) {
      valorFinal += aporteMensal * Math.pow(1 + taxaMensal, meses - i - 1);
    }

    // Rendimento total
    const rendimentoTotal = valorFinal - (valorInicial + aporteMensal * meses);

    // Valor por classe de ativo
    const valorPorClasse = {
      rendaFixa: valorFinal * (rendaFixa / 100),
      acoes: valorFinal * (acoes / 100),
      fundosImobiliarios: valorFinal * (fundosImobiliarios / 100),
      internacional: valorFinal * (internacional / 100),
    };

    setResultados({
      valorFinal,
      rendimentoTotal,
      rentabilidadeMedia,
      valorPorClasse,
    });
  };

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatarPorcentagem = (valor: number) => {
    return valor.toFixed(2) + "%";
  };

  return (
    <div className="w-full mx-auto space-y-4 md:space-y-6 lg:space-y-8">
      <Tabs
        defaultValue="alocacao"
        className="space-y-2 sm:space-y-3 md:space-y-4"
      >
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger
            value="alocacao"
            className="text-[10px] sm:text-xs md:text-sm py-1 sm:py-1.5 md:py-2"
          >
            Alocação de Ativos
          </TabsTrigger>
          <TabsTrigger
            value="rentabilidade"
            className="text-[10px] sm:text-xs md:text-sm py-1 sm:py-1.5 md:py-2"
          >
            Rentabilidade Esperada
          </TabsTrigger>
        </TabsList>

        <TabsContent value="alocacao" className="space-y-3 md:space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 md:gap-6 lg:gap-8">
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              <div className="space-y-1.5 md:space-y-2">
                <Label
                  htmlFor="valor-inicial"
                  className="text-xs sm:text-sm md:text-base"
                >
                  Valor Inicial
                </Label>
                <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
                  <Input
                    id="valor-inicial"
                    type="number"
                    min={1000}
                    value={valorInicial}
                    onChange={(e) => setValorInicial(Number(e.target.value))}
                    className="flex-1 h-8 sm:h-9 md:h-10 text-xs sm:text-sm"
                  />
                  <span className="text-xs sm:text-sm text-muted-foreground w-14 sm:w-16 md:w-20 truncate">
                    {formatarMoeda(valorInicial)}
                  </span>
                </div>
                <Slider
                  value={[valorInicial]}
                  min={1000}
                  max={1000000}
                  step={1000}
                  onValueChange={(value) => setValorInicial(value[0])}
                  className="py-1 md:py-2 mt-1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aporte-mensal">Aporte Mensal</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="aporte-mensal"
                    type="number"
                    min={0}
                    value={aporteMensal}
                    onChange={(e) => setAporteMensal(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground w-24">
                    {formatarMoeda(aporteMensal)}
                  </span>
                </div>
                <Slider
                  value={[aporteMensal]}
                  min={0}
                  max={10000}
                  step={100}
                  onValueChange={(value) => setAporteMensal(value[0])}
                  className="py-2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prazo-anos">Prazo (anos)</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="prazo-anos"
                    type="number"
                    min={1}
                    max={40}
                    value={prazoAnos}
                    onChange={(e) => setPrazoAnos(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground w-24">
                    {prazoAnos} anos
                  </span>
                </div>
                <Slider
                  value={[prazoAnos]}
                  min={1}
                  max={40}
                  step={1}
                  onValueChange={(value) => setPrazoAnos(value[0])}
                  className="py-2"
                />
              </div>

              <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t">
                <h3 className="font-medium text-xs sm:text-sm md:text-base">
                  Alocação de Ativos (Total: 100%)
                </h3>

                <div className="space-y-1 sm:space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="renda-fixa" className="text-xs sm:text-sm">
                      Renda Fixa
                    </Label>
                    <span className="text-xs sm:text-sm font-medium">
                      {rendaFixa}%
                    </span>
                  </div>
                  <Slider
                    id="renda-fixa"
                    value={[rendaFixa]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => handleRendaFixaChange(value[0])}
                    className="py-1 md:py-2"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="acoes">Ações</Label>
                    <span className="text-sm font-medium">{acoes}%</span>
                  </div>
                  <Slider
                    id="acoes"
                    value={[acoes]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => handleAcoesChange(value[0])}
                    className="py-2"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="fundos-imobiliarios">
                      Fundos Imobiliários
                    </Label>
                    <span className="text-sm font-medium">
                      {fundosImobiliarios}%
                    </span>
                  </div>
                  <Slider
                    id="fundos-imobiliarios"
                    value={[fundosImobiliarios]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) =>
                      handleFundosImobiliariosChange(value[0])
                    }
                    className="py-2"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="internacional">Internacional</Label>
                    <span className="text-sm font-medium">
                      {internacional}%
                    </span>
                  </div>
                  <Slider
                    id="internacional"
                    value={[internacional]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) =>
                      handleInternacionalChange(value[0])
                    }
                    className="py-2"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <Card className="bg-[#001122]/5 h-full shadow-md border border-[#001122]/10">
                    <CardContent className="p-3 sm:p-4 md:p-6">
                      <h3 className="text-sm md:text-base lg:text-lg font-medium mb-3 sm:mb-4 md:mb-6">
                        Distribuição da Carteira
                      </h3>

                      <div className="flex justify-center mb-3 sm:mb-4 md:mb-6">
                        <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48">
                          <PieChart className="w-full h-full text-[#1A2A3A]" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs sm:text-sm font-semibold text-slate-900 mt-10">
                              100%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                            <span className="text-sm">Renda Fixa</span>
                          </div>
                          <span className="text-sm font-medium">
                            {rendaFixa}%
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                            <span className="text-sm">Ações</span>
                          </div>
                          <span className="text-sm font-medium">{acoes}%</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                            <span className="text-sm">Fundos Imobiliários</span>
                          </div>
                          <span className="text-sm font-medium">
                            {fundosImobiliarios}%
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                            <span className="text-sm">Internacional</span>
                          </div>
                          <span className="text-sm font-medium">
                            {internacional}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6">
                  <Button
                    onClick={calcularCarteira}
                    className="w-full bg-[#1A2A3A] hover:bg-[#0D1520] py-1.5 sm:py-2 md:py-3 text-xs sm:text-sm md:text-base"
                  >
                    <Calculator className="mr-1.5 md:mr-2 h-3 w-3 md:h-4 md:w-4" />{" "}
                    Simular Carteira
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rentabilidade" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <h3 className="font-medium">Rentabilidade Esperada (% ao ano)</h3>

              <div className="space-y-2">
                <Label htmlFor="renda-fixa-rent">Renda Fixa</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="renda-fixa-rent"
                    type="number"
                    min={1}
                    max={20}
                    step={0.5}
                    value={rendaFixaRent}
                    onChange={(e) => setRendaFixaRent(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground w-16">
                    {rendaFixaRent}% a.a.
                  </span>
                </div>
                <Slider
                  value={[rendaFixaRent]}
                  min={1}
                  max={20}
                  step={0.5}
                  onValueChange={(value) => setRendaFixaRent(value[0])}
                  className="py-2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="acoes-rent">Ações</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="acoes-rent"
                    type="number"
                    min={1}
                    max={30}
                    step={0.5}
                    value={acoesRent}
                    onChange={(e) => setAcoesRent(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground w-16">
                    {acoesRent}% a.a.
                  </span>
                </div>
                <Slider
                  value={[acoesRent]}
                  min={1}
                  max={30}
                  step={0.5}
                  onValueChange={(value) => setAcoesRent(value[0])}
                  className="py-2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fundos-imobiliarios-rent">
                  Fundos Imobiliários
                </Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="fundos-imobiliarios-rent"
                    type="number"
                    min={1}
                    max={25}
                    step={0.5}
                    value={fundosImobiliariosRent}
                    onChange={(e) =>
                      setFundosImobiliariosRent(Number(e.target.value))
                    }
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground w-16">
                    {fundosImobiliariosRent}% a.a.
                  </span>
                </div>
                <Slider
                  value={[fundosImobiliariosRent]}
                  min={1}
                  max={25}
                  step={0.5}
                  onValueChange={(value) => setFundosImobiliariosRent(value[0])}
                  className="py-2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="internacional-rent">Internacional</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="internacional-rent"
                    type="number"
                    min={1}
                    max={30}
                    step={0.5}
                    value={internacionalRent}
                    onChange={(e) =>
                      setInternacionalRent(Number(e.target.value))
                    }
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground w-16">
                    {internacionalRent}% a.a.
                  </span>
                </div>
                <Slider
                  value={[internacionalRent]}
                  min={1}
                  max={30}
                  step={0.5}
                  onValueChange={(value) => setInternacionalRent(value[0])}
                  className="py-2"
                />
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    Rentabilidade Média Ponderada:
                  </span>
                  <span className="text-lg font-bold text-green-500">
                    {formatarPorcentagem(
                      (rendaFixa / 100) * rendaFixaRent +
                        (acoes / 100) * acoesRent +
                        (fundosImobiliarios / 100) * fundosImobiliariosRent +
                        (internacional / 100) * internacionalRent
                    )}
                  </span>
                </div>
              </div>

              <Button
                onClick={calcularCarteira}
                className="w-full bg-[#1A2A3A] hover:bg-[#0D1520]"
              >
                <Calculator className="mr-2 h-4 w-4" /> Simular Carteira
              </Button>
            </div>

            <div>
              <Card className="bg-[#001122]/5 h-full">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">
                    Rentabilidade por Classe de Ativo
                  </h3>

                  <div className="space-y-6 mt-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                          <span className="text-sm">Renda Fixa</span>
                        </div>
                        <span className="text-sm font-medium">
                          {rendaFixaRent}% a.a.
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(rendaFixaRent / 30) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                          <span className="text-sm">Ações</span>
                        </div>
                        <span className="text-sm font-medium">
                          {acoesRent}% a.a.
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(acoesRent / 30) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                          <span className="text-sm">Fundos Imobiliários</span>
                        </div>
                        <span className="text-sm font-medium">
                          {fundosImobiliariosRent}% a.a.
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-amber-500 h-2 rounded-full"
                          style={{
                            width: `${(fundosImobiliariosRent / 30) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                          <span className="text-sm">Internacional</span>
                        </div>
                        <span className="text-sm font-medium">
                          {internacionalRent}% a.a.
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{
                            width: `${(internacionalRent / 30) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      As rentabilidades acima são estimativas baseadas em dados
                      históricos e projeções de mercado. Rentabilidades passadas
                      não garantem rentabilidades futuras.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {resultados && (
        <Card className="bg-[#001122]/5 shadow-md border border-[#001122]/10">
          <CardContent className="p-3 sm:p-4 md:p-6">
            <h3 className="text-sm md:text-lg lg:text-xl font-bold mb-3 sm:mb-4 md:mb-6">
              Resultado da Simulação
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Patrimônio Final Estimado
                  </p>
                  <p className="text-3xl font-bold">
                    {formatarMoeda(resultados.valorFinal)}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Rendimento Total
                  </p>
                  <p className="text-2xl font-bold text-green-500">
                    {formatarMoeda(resultados.rendimentoTotal)}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Rentabilidade Média Anual
                  </p>
                  <p className="text-xl font-bold">
                    {formatarPorcentagem(resultados.rentabilidadeMedia)}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-medium">
                  Distribuição do Patrimônio Final
                </p>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                        <span className="text-sm">Renda Fixa</span>
                      </div>
                      <span className="text-sm font-medium">
                        {formatarMoeda(resultados.valorPorClasse.rendaFixa)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${rendaFixa}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm">Ações</span>
                      </div>
                      <span className="text-sm font-medium">
                        {formatarMoeda(resultados.valorPorClasse.acoes)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${acoes}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                        <span className="text-sm">Fundos Imobiliários</span>
                      </div>
                      <span className="text-sm font-medium">
                        {formatarMoeda(
                          resultados.valorPorClasse.fundosImobiliarios
                        )}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-amber-500 h-2 rounded-full"
                        style={{ width: `${fundosImobiliarios}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                        <span className="text-sm">Internacional</span>
                      </div>
                      <span className="text-sm font-medium">
                        {formatarMoeda(resultados.valorPorClasse.internacional)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${internacional}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Esta simulação considera uma alocação constante ao longo do
                tempo. Em um cenário real, é recomendável ajustar a alocação
                conforme seus objetivos e perfil de risco evoluem.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-[#001122]/5 p-3 sm:p-4 md:p-6 rounded-lg shadow-sm border border-[#001122]/10">
        <h3 className="font-medium mb-1 sm:mb-2 text-sm md:text-base">
          Dicas para Diversificação de Carteira
        </h3>
        <ul className="text-xs md:text-sm text-muted-foreground space-y-1 sm:space-y-2">
          <li>
            • Diversifique entre diferentes classes de ativos para reduzir o
            risco.
          </li>
          <li>
            • Ajuste sua alocação de acordo com seu perfil de risco e horizonte
            de investimento.
          </li>
          <li>
            • Rebalanceie sua carteira periodicamente para manter a alocação
            desejada.
          </li>
          <li>
            • Considere a correlação entre os ativos ao montar sua carteira.
          </li>
          <li>
            • Consulte um especialista financeiro para orientação personalizada.
          </li>
        </ul>
      </div>
    </div>
  );
}
