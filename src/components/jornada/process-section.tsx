"use client"

import { useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { CheckCircle, ArrowRight, Clock, FileText, BarChart } from "lucide-react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

export function ProcessSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activeStep, setActiveStep] = useState<number | null>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })


  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, 100])

  const steps = [
    {
      number: "01",
      title: "Análise Personalizada",
      description: "Nossa equipe especializada realiza uma análise completa do seu patrimônio e objetivos.",
      icon: BarChart,
      details: "Utilizamos tecnologia avançada para mapear seus ativos, passivos e objetivos de longo prazo, criando um diagnóstico completo da sua situação patrimonial atual.",
      duration: "3-5 dias úteis"
    },
    {
      number: "02",
      title: "Planejamento Estratégico",
      description: "Desenvolvemos uma estratégia personalizada para a estruturação da sua holding.",
      icon: FileText,
      details: "Com base na análise inicial, nossos especialistas elaboram um plano detalhado de estruturação, considerando aspectos tributários, sucessórios e de proteção patrimonial.",
      duration: "7-10 dias úteis"
    },
    {
      number: "03",
      title: "Documentação Digital",
      description: "Todo o processo documental é realizado digitalmente, sem burocracia.",
      icon: CheckCircle,
      details: "Nosso sistema automatizado prepara toda a documentação necessária, incluindo contratos, estatutos e registros, com assinatura digital certificada e validação jurídica.",
      duration: "5-7 dias úteis"
    },
    {
      number: "04",
      title: "Implementação Rápida",
      description: "Sua holding é constituída em tempo recorde com nossa tecnologia exclusiva.",
      icon: Clock,
      details: "Finalizamos o processo de constituição da sua holding com registro nos órgãos competentes, abertura de contas bancárias e integração com seus sistemas de gestão existentes.",
      duration: "15-20 dias úteis"
    },
  ]

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full min-h-screen bg-black flex items-center py-20"
      id="processo"
    >
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] opacity-5 bg-cover bg-center mix-blend-overlay" />

      <div className="container relative z-10 px-4 md:px-6">
        <motion.div 

          className="max-w-5xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 text-center">
            Um processo{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              simplificado
            </span>{" "}
            e eficiente
          </h2>
          <p className="text-xl text-white/70 mb-16 text-center max-w-3xl mx-auto">
            Abrir uma holding nunca foi tão fácil. A W1 revoluciona o processo com tecnologia e expertise.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {steps.map((step, index) => (
              <HoverCard key={index} openDelay={100} closeDelay={100}>
                <HoverCardTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    onMouseEnter={() => setActiveStep(index)}
                    onMouseLeave={() => setActiveStep(null)}
                    className="relative"
                  >
                    <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/30 transition-all duration-300 h-full overflow-hidden group">
                      <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                      
                      <CardHeader className="pb-2 relative z-10">
                        <div className="flex items-start justify-between">
                          <div className="bg-gradient-to-br from-blue-500 to-emerald-500 p-3 rounded-xl">
                            <step.icon className="w-6 h-6 text-white" />
                          </div>
                          <Badge 
                            variant="outline" 
                            className="bg-white/10 text-white border-white/20 px-3 py-1"
                          >
                            {step.number}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl font-semibold text-white mt-4">{step.title}</CardTitle>
                        <CardDescription className="text-white/70">{step.description}</CardDescription>
                      </CardHeader>
                      
                      <CardFooter className="pt-2 pb-4 relative z-10">
                        <div className="flex items-center text-xs text-white/50">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>{step.duration}</span>
                        </div>
                        <div className="ml-auto text-white/50 group-hover:text-white/80 transition-colors">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </CardFooter>
                      
                      <motion.div 
                        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-400 to-emerald-400"
                        initial={{ width: "0%" }}
                        animate={{ width: activeStep === index ? "100%" : "0%" }}
                        transition={{ duration: 0.5 }}
                      />
                    </Card>
                  </motion.div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 bg-card/95 backdrop-blur-sm border-white/20">
                  <div className="flex justify-between space-x-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.details}</p>
                      <div className="flex items-center pt-2">
                        <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {step.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <p className="text-white/70 max-w-2xl mx-auto">
              Todo o processo leva em média <span className="text-white font-semibold">30-45 dias</span>, muito mais rápido que os métodos tradicionais que podem levar meses.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
