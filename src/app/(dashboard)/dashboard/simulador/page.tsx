"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { SimuladorEmprestimo } from "@/components/simulador/simulador-emprestimo";
import { SimuladorRendaFixa } from "@/components/simulador/simulador-renda-fixa";
import { SimuladorFundoEmergencia } from "@/components/simulador/simulador-fundo-emergencia";
import { SimuladorCarteira } from "@/components/simulador/simulador-carteira";
import { SimuladorAposentadoria } from "@/components/simulador/simulador-aposentadoria";

export default function Home() {
  const [activeTab, setActiveTab] = useState("emprestimo");
  const [scrollPosition, setScrollPosition] = useState(0);

  const tabs = [
    { id: "emprestimo", label: "Empréstimo" },
    { id: "renda-fixa", label: "Renda Fixa" },
    { id: "fundo-emergencia", label: "Fundo de Emergência" },
    { id: "carteira", label: "Carteira" },
    { id: "aposentadoria", label: "Aposentadoria" },
  ];

  const handleScroll = (direction: "left" | "right") => {
    const tabsContainer = document.getElementById("tabs-container");
    if (tabsContainer) {
      const scrollAmount = 200;
      const newPosition =
        direction === "left"
          ? Math.max(0, scrollPosition - scrollAmount)
          : scrollPosition + scrollAmount;

      tabsContainer.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });

      setScrollPosition(newPosition);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-2 sm:px-4 py-6 md:py-10 lg:py-16">
        <div className="text-center mb-6 md:mb-10">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#1A2A3A] mb-2 md:mb-4">
            Simuladores Financeiros
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Planeje seu futuro financeiro com nossas ferramentas de simulação.
            Calcule empréstimos, investimentos, aposentadoria e muito mais.
          </p>
        </div>

        <Tabs value={activeTab} className="w-full">
          <div className="relative flex items-center mb-6 md:mb-8 bg-gray-100 rounded-2xl">
            {/* Botão de navegação esquerda */}
            <button
              onClick={() => handleScroll("left")}
              className="absolute left-0 z-10 flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-md border border-gray-200 text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1A2A3A] focus:ring-opacity-50 md:hidden"
              aria-label="Rolar para a esquerda"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Container de tabs com scroll */}
            <div
              id="tabs-container"
              className="flex-1 overflow-x-auto scrollbar-hide py-2 px-6 md:px-0 md:flex md:justify-center"
            >
              <div className="flex space-x-2 md:space-x-3 md:bg-muted/80 md:backdrop-blur-sm md:p-1.5 md:rounded-xl">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      cursor-pointer whitespace-nowrap px-4 py-2.5 rounded-lg text-sm md:text-base font-medium transition-all
                      ${
                        activeTab === tab.id
                          ? "bg-[#1A2A3A] text-white shadow-md"
                          : "bg-gray-300 text-gray-700 hover:bg-slate-500 hover:text-white"
                      }
                    `}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Botão de navegação direita */}
            <button
              onClick={() => handleScroll("right")}
              className="absolute right-0 z-10 flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-md border border-gray-200 text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1A2A3A] focus:ring-opacity-50 md:hidden"
              aria-label="Rolar para a direita"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg border p-3 sm:p-4 md:p-6 lg:p-8">
            <TabsContent value="emprestimo" className="mt-0">
              <SimuladorEmprestimo />
            </TabsContent>
            <TabsContent value="renda-fixa" className="mt-0">
              <SimuladorRendaFixa />
            </TabsContent>
            <TabsContent value="fundo-emergencia" className="mt-0">
              <SimuladorFundoEmergencia />
            </TabsContent>
            <TabsContent value="carteira" className="mt-0">
              <SimuladorCarteira />
            </TabsContent>
            <TabsContent value="aposentadoria" className="mt-0">
              <SimuladorAposentadoria />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </main>
  );
}
