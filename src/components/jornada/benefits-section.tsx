"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Shield, TrendingUp, Landmark, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function BenefitsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  // Mantendo a animação de escala para a seção inteira
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.9, 1, 1, 0.9])

  const benefits = [
    {
      title: "Proteção Patrimonial",
      description: "Blindagem efetiva do seu patrimônio contra riscos empresariais e pessoais.",
      icon: Shield,
      color: "from-blue-500 to-blue-700",
    },
    {
      title: "Planejamento Sucessório",
      description: "Transferência de bens para herdeiros de forma organizada e com menor carga tributária.",
      icon: FileText,
      color: "from-emerald-500 to-emerald-700",
    },
    {
      title: "Otimização Fiscal",
      description: "Redução legal da carga tributária através de estratégias fiscais inteligentes.",
      icon: TrendingUp,
      color: "from-purple-500 to-purple-700",
    },
    {
      title: "Gestão Centralizada",
      description: "Administração unificada de todos os seus ativos e investimentos.",
      icon: Landmark,
      color: "from-amber-500 to-amber-700",
    },
  ]

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full min-h-[80vh] bg-zinc-900 flex items-center py-20 overflow-hidden"
      id="beneficios"
    >
      {/* Fundo radial mantido */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800/50 to-zinc-900" />

      <div className="container relative z-10 px-4 md:px-6">
        {/* Animação de escala e opacidade aplicada ao container principal */}
        <motion.div 
          style={{ scale}} 
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Benefícios que{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-red-500">
              transformam
            </span>{" "}
            seu futuro financeiro
          </h2>
          <p className="text-xl text-white/70 mb-12 max-w-3xl mx-auto">
            Uma holding bem estruturada oferece vantagens significativas para a proteção e crescimento do seu
            patrimônio.
          </p>

          {/* Grid para os cards de benefícios */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true, amount: 0.3 }}
                className="h-full"
              >
                {/* Card do shadcn/ui com estilização consistente */}
                <Card className="bg-white/5 backdrop-blur-md border border-white/10 h-full group hover:border-white/20 transition-all duration-300 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  <CardHeader className="relative z-10">
                    <div className={`bg-gradient-to-br ${benefit.color} p-3 rounded-lg w-fit mb-4 shadow-lg`}>
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-white">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <CardDescription className="text-white/70">{benefit.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
