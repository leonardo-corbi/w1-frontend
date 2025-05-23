"use client"

import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  TrendingUp, 
  BarChart as BarChartIcon, 
  PieChart as PieChartIcon, 
  LineChart as LineChartIcon, 
  MousePointer 
} from "lucide-react"
import { 
  ChartContainer, 
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

export function FinanceVisualsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Detectar se o JavaScript está habilitado e componente montado
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Configuração de cores para os gráficos
  const chartConfig = {
    growth: {
      label: "Crescimento",
      theme: {
        light: "#10b981",
        dark: "#10b981"
      }
    },
    savings: {
      label: "Economia",
      theme: {
        light: "#0ea5e9",
        dark: "#0ea5e9"
      }
    },
    costs: {
      label: "Custos",
      theme: {
        light: "#6366f1",
        dark: "#6366f1"
      }
    },
    traditional: {
      label: "Tradicional",
      theme: {
        light: "#f87171",
        dark: "#f87171"
      }
    },
    holding: {
      label: "Holding",
      theme: {
        light: "#0ea5e9",
        dark: "#0ea5e9"
      }
    },
    imoveis: {
      label: "Imóveis",
      theme: {
        light: "#0ea5e9",
        dark: "#0ea5e9"
      }
    },
    acoes: {
      label: "Ações",
      theme: {
        light: "#6366f1",
        dark: "#6366f1"
      }
    },
    fundos: {
      label: "Fundos",
      theme: {
        light: "#60a5fa",
        dark: "#60a5fa"
      }
    },
    tesouro: {
      label: "Tesouro",
      theme: {
        light: "#34d399",
        dark: "#34d399"
      }
    },
    outros: {
      label: "Outros",
      theme: {
        light: "#f472b6",
        dark: "#f472b6"
      }
    }
  }

  // Dados para os gráficos
  const lineChartData = [
    { year: "Ano 1", growth: 100 },
    { year: "Ano 2", growth: 120 },
    { year: "Ano 3", growth: 150 },
    { year: "Ano 4", growth: 170 },
    { year: "Ano 5", growth: 200 },
    { year: "Ano 6", growth: 230 },
    { year: "Ano 7", growth: 260 },
    { year: "Ano 8", growth: 290 },
    { year: "Ano 9", growth: 310 },
    { year: "Ano 10", growth: 317 }
  ]

  const barChartData = [
    { name: "Antes", costs: 100 },
    { name: "Depois", costs: 30 }
  ]

  const pieChartData = [
    { name: "imoveis", value: 35 },
    { name: "acoes", value: 25 },
    { name: "fundos", value: 20 },
    { name: "tesouro", value: 15 },
    { name: "outros", value: 5 }
  ]

  const areaChartData = [
    { year: "Ano 1", growth: 100 },
    { year: "Ano 2", growth: 140 },
    { year: "Ano 3", growth: 180 },
    { year: "Ano 4", growth: 220 },
    { year: "Ano 5", growth: 260 },
    { year: "Ano 6", growth: 300 },
    { year: "Ano 7", growth: 350 },
    { year: "Ano 8", growth: 400 },
    { year: "Ano 9", growth: 450 },
    { year: "Ano 10", growth: 532 }
  ]

  const stackedBarChartData = [
    { year: "Ano 1", savings: 20, costs: 40 },
    { year: "Ano 2", savings: 25, costs: 35 },
    { year: "Ano 3", savings: 30, costs: 40 },
    { year: "Ano 4", savings: 35, costs: 45 },
    { year: "Ano 5", savings: 40, costs: 50 }
  ]

  const multiLineChartData = [
    { year: "Ano 1", traditional: 100, holding: 100 },
    { year: "Ano 2", traditional: 105, holding: 115 },
    { year: "Ano 3", traditional: 110, holding: 135 },
    { year: "Ano 4", traditional: 115, holding: 160 },
    { year: "Ano 5", traditional: 120, holding: 190 },
    { year: "Ano 6", traditional: 125, holding: 225 },
    { year: "Ano 7", traditional: 130, holding: 265 },
    { year: "Ano 8", traditional: 135, holding: 310 },
    { year: "Ano 9", traditional: 140, holding: 360 },
    { year: "Ano 10", traditional: 145, holding: 420 }
  ]

  type ChartType = "line" | "bar" | "pie" | "area" | "stackedBar" | "multiLine";

  interface FinancialCardData {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    chartType: ChartType;
    data: any[];
    indicator: string;
  }

  const financialCards: FinancialCardData[] = [
    {
      id: "growth",
      title: "Crescimento Patrimonial",
      description: "Projeção de crescimento com estratégias de holding",
      icon: TrendingUp,
      chartType: "line",
      data: lineChartData,
      indicator: "+217%"
    },
    {
      id: "tax",
      title: "Otimização Tributária",
      description: "Comparativo de carga tributária antes e depois",
      icon: BarChartIcon,
      chartType: "bar",
      data: barChartData,
      indicator: "-70% impostos"
    },
    {
      id: "assets",
      title: "Diversificação de Ativos",
      description: "Distribuição ideal para proteção patrimonial",
      icon: PieChartIcon,
      chartType: "pie",
      data: pieChartData,
      indicator: "35% Imóveis"
    },
    {
      id: "projection",
      title: "Projeção de Longo Prazo",
      description: "Simulação de crescimento em 10 anos",
      icon: LineChartIcon,
      chartType: "area",
      data: areaChartData,
      indicator: "+432%"
    },
    {
      id: "savings",
      title: "Economia Fiscal",
      description: "Economia acumulada ao longo do tempo",
      icon: BarChartIcon,
      chartType: "stackedBar",
      data: stackedBarChartData,
      indicator: "Economia crescente"
    },
    {
      id: "comparison",
      title: "Comparativo de Estruturas",
      description: "Holding vs. Estruturas tradicionais",
      icon: LineChartIcon,
      chartType: "multiLine",
      data: multiLineChartData,
      indicator: "+190% diferença"
    }
  ]

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen bg-gradient-to-b from-[#001a33] to-[#003366] py-16 sm:py-20 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] opacity-5 bg-cover bg-center mix-blend-overlay" />

      <div className="container relative z-10 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Visualize o{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-400">futuro</span>{" "}
              do seu patrimônio
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Interaja com nossas visualizações financeiras e descubra o potencial de crescimento com a W1 Holdings.
            </p>
            {isMounted && (
              <div className="mt-6 flex items-center justify-center gap-2 text-white/60">
                <MousePointer className="h-4 w-4 animate-bounce" />
                <span>Passe o mouse sobre os gráficos para interagir</span>
              </div>
            )}
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {financialCards.map((card) => (
              <FinancialCard
                key={card.id}
                id={card.id}
                title={card.title}
                description={card.description}
                icon={card.icon}
                chartType={card.chartType}
                data={card.data}
                indicator={card.indicator}
                chartConfig={chartConfig}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

interface FinancialCardProps {
  id: string
  title: string
  description: string
  icon: React.ElementType
  chartType: "line" | "bar" | "pie" | "area" | "stackedBar" | "multiLine"
  data: any[]
  indicator: string
  chartConfig: Record<string, any>
}

function FinancialCard({ 
  id, 
  title, 
  description, 
  icon: Icon, 
  chartType, 
  data,
  indicator,
  chartConfig
}: FinancialCardProps) {
  return (
    <HoverCard openDelay={0} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/30 transition-all duration-300 h-[400px] cursor-pointer flex flex-col">
          <CardHeader className="pb-2 flex flex-col gap-2">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-xl w-fit mb-4">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-xl font-semibold text-white mb-1">{title}</CardTitle>
            <CardDescription className="text-white/70 mb-1">{description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center">
            <div className="relative h-[200px] w-full flex items-center justify-center">
              {chartType === "line" && (
                <ChartContainer config={chartConfig} className="h-full">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="year" 
                      stroke="rgba(255,255,255,0.5)" 
                      fontSize={10}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.5)" 
                      fontSize={10}
                      tickLine={false}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                      content={(props) => {
                        if (props.active && props.payload && props.payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-md">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">
                                    {props.payload[0].payload.year}
                                  </span>
                                  <span className="font-bold text-muted-foreground">
                                    {props.payload[0].value}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="growth"
                      name="growth"
                      stroke="var(--color-growth)"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6, fill: "var(--color-growth)" }}
                    />
                  </LineChart>
                </ChartContainer>
              )}

              {chartType === "bar" && (
                <ChartContainer config={chartConfig} className="h-full">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="name" 
                      stroke="rgba(255,255,255,0.5)" 
                      fontSize={10}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.5)" 
                      fontSize={10}
                      tickLine={false}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                      content={(props) => {
                        if (props.active && props.payload && props.payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-md">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">
                                    {props.payload[0].payload.name}
                                  </span>
                                  <span className="font-bold text-muted-foreground">
                                    {props.payload[0].value}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar 
                      dataKey="costs" 
                      name="costs" 
                      fill="var(--color-costs)" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              )}

              {chartType === "pie" && (
                <ChartContainer config={chartConfig} className="h-full">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={0}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                    >
                      {data.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={`var(--color-${entry.name})`} 
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={(props) => {
                        if (props.active && props.payload && props.payload.length) {
                          const name = props.payload[0].name as string;
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-md">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">
                                    {chartConfig[name]?.label || name}
                                  </span>
                                  <span className="font-bold text-muted-foreground">
                                    {props.payload[0].value}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Legend 
                      content={(props) => (
                        <div className="flex flex-wrap justify-center gap-2 text-xs text-white/70">
                          {props.payload?.map((entry, index) => {
                            // Extrair o nome de forma segura
                            let displayName = "";
                            if (entry.payload && typeof entry.payload === 'object') {
                              // Usar type assertion após verificar que é um objeto
                              const payload = entry.payload as Record<string, any>;
                              displayName = payload.name || "";
                            }
                            
                            return (
                              <div key={`legend-${index}`} className="flex items-center gap-1">
                                <div 
                                  className="w-2 h-2 rounded-full" 
                                  style={{ backgroundColor: entry.color }}
                                />
                                <span>{chartConfig[displayName]?.label || displayName}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    />
                  </PieChart>
                </ChartContainer>
              )}

              {chartType === "area" && (
                <ChartContainer config={chartConfig} className="h-full">
                  <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="year" 
                      stroke="rgba(255,255,255,0.5)" 
                      fontSize={10}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.5)" 
                      fontSize={10}
                      tickLine={false}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                      content={(props) => {
                        if (props.active && props.payload && props.payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-md">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">
                                    {props.payload[0].payload.year}
                                  </span>
                                  <span className="font-bold text-muted-foreground">
                                    {props.payload[0].value}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="growth"
                      name="growth"
                      stroke="var(--color-growth)"
                      fill="var(--color-growth)"
                      fillOpacity={0.3}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6, fill: "var(--color-growth)" }}
                    />
                  </AreaChart>
                </ChartContainer>
              )}

              {chartType === "stackedBar" && (
                <ChartContainer config={chartConfig} className="h-full">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="year" 
                      stroke="rgba(255,255,255,0.5)" 
                      fontSize={10}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.5)" 
                      fontSize={10}
                      tickLine={false}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                      content={(props) => {
                        if (props.active && props.payload && props.payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-md">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">
                                    {props.payload[0].payload.year}
                                  </span>
                                  <span className="font-bold text-muted-foreground">
                                    Economia: {props.payload[0].value}%
                                  </span>
                                  <span className="font-bold text-muted-foreground">
                                    Custos: {props.payload[1].value}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar 
                      dataKey="savings" 
                      name="savings" 
                      stackId="a" 
                      fill="var(--color-savings)" 
                      radius={[0, 0, 0, 0]}
                    />
                    <Bar 
                      dataKey="costs" 
                      name="costs" 
                      stackId="a" 
                      fill="var(--color-costs)" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Legend 
                      content={(props) => (
                        <div className="flex flex-wrap justify-center gap-2 text-xs text-white/70">
                          {props.payload?.map((entry, index) => {
                            // Extrair a chave de dados de forma segura
                            const dataKey = typeof entry.dataKey === 'string' ? entry.dataKey : "";
                            
                            return (
                              <div key={`legend-${index}`} className="flex items-center gap-1">
                                <div 
                                  className="w-2 h-2 rounded-full" 
                                  style={{ backgroundColor: entry.color }}
                                />
                                <span>{chartConfig[dataKey]?.label || dataKey}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    />
                  </BarChart>
                </ChartContainer>
              )}

              {chartType === "multiLine" && (
                <ChartContainer config={chartConfig} className="h-full">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="year" 
                      stroke="rgba(255,255,255,0.5)" 
                      fontSize={10}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.5)" 
                      fontSize={10}
                      tickLine={false}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                      content={(props) => {
                        if (props.active && props.payload && props.payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-md">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">
                                    {props.payload[0].payload.year}
                                  </span>
                                  <span className="font-bold text-muted-foreground">
                                    Holding: {props.payload[1].value}%
                                  </span>
                                  <span className="font-bold text-muted-foreground">
                                    Tradicional: {props.payload[0].value}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="traditional"
                      name="traditional"
                      stroke="var(--color-traditional)"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                      activeDot={{ r: 6, fill: "var(--color-traditional)" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="holding"
                      name="holding"
                      stroke="var(--color-holding)"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6, fill: "var(--color-holding)" }}
                    />
                    <Legend 
                      content={(props) => (
                        <div className="flex flex-wrap justify-center gap-2 text-xs text-white/70">
                          {props.payload?.map((entry, index) => {
                            // Extrair a chave de dados de forma segura
                            const dataKey = typeof entry.dataKey === 'string' ? entry.dataKey : "";
                            
                            return (
                              <div key={`legend-${index}`} className="flex items-center gap-1">
                                <div 
                                  className="w-2 h-2 rounded-full" 
                                  style={{ backgroundColor: entry.color }}
                                />
                                <span>{chartConfig[dataKey]?.label || dataKey}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    />
                  </LineChart>
                </ChartContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
            <div className="flex items-center pt-2">
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                {indicator}
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
