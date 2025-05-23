"use client";

import type React from "react";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { TrendingUp, ArrowUpRight, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InteractiveChartSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeYear, setActiveYear] = useState(5);
  const [isPlaying, setIsPlaying] = useState(false);

  // Mouse parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = containerRef.current?.getBoundingClientRect() || {
      left: 0,
      top: 0,
    };
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const backgroundX = useTransform(mouseX, [0, 1000], [50, 40]);
  const backgroundY = useTransform(mouseY, [0, 1000], [50, 40]);

  // Chart data
  const years = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const traditionalValues = [100, 120, 145, 175, 210, 255, 310, 375, 450, 540];
  const holdingValues = [100, 110, 120, 135, 150, 165, 180, 200, 220, 240];

  // Animation for chart line
  const chartLinePoints = years
    .map((year, index) => {
      const x = (index / (years.length - 1)) * 100;
      const y =
        100 -
        ((holdingValues[index] - 100) /
          (holdingValues[years.length - 1] - 100)) *
          100;
      return `${x},${y}`;
    })
    .join(" ");

  // Calculate percentage difference
  const percentageDiff = Math.round(
    ((holdingValues[activeYear - 1] - traditionalValues[activeYear - 1]) /
      traditionalValues[activeYear - 1]) *
      100
  );

  // Play animation
  const playAnimation = () => {
    setIsPlaying(true);
    let currentYear = 1;

    const interval = setInterval(() => {
      if (currentYear <= 10) {
        setActiveYear(currentYear);
        currentYear++;
      } else {
        clearInterval(interval);
        setIsPlaying(false);
      }
    }, 500);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-screen overflow-hidden"
    >
      {/* Background with parallax effect */}
      <motion.div
        className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-no-repeat opacity-10"
        style={{
          backgroundPosition: `${backgroundX}% ${backgroundY}%`,
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-[#002b4d] to-[#001a2e]" />

      <div className="container relative z-10 px-4 md:px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Simule o{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-400">
                crescimento
              </span>{" "}
              do seu patrimônio
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Veja a diferença entre uma estrutura tradicional e uma holding ao
              longo do tempo.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-white">
                    Crescimento Patrimonial
                  </h3>
                  <Button
                    onClick={playAnimation}
                    disabled={isPlaying}
                    variant="outline"
                    size="sm"
                    className="text-black border-white/20 hover:bg-white/10"
                  >
                    {isPlaying ? "Simulando..." : "Simular"}
                  </Button>
                </div>

                <div className="relative h-[300px] w-full">
                  {/* Chart grid */}
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 100 100"
                    className="absolute inset-0"
                  >
                    {/* Horizontal grid lines */}
                    {[0, 25, 50, 75, 100].map((y) => (
                      <line
                        key={`h-${y}`}
                        x1="0"
                        y1={y}
                        x2="100"
                        y2={y}
                        stroke="rgba(255,255,255,0.1)"
                        strokeDasharray="2 2"
                      />
                    ))}

                    {/* Vertical grid lines */}
                    {years.map((_, i) => {
                      const x = (i / (years.length - 1)) * 100;
                      return (
                        <line
                          key={`v-${i}`}
                          x1={x}
                          y1="0"
                          x2={x}
                          y2="100"
                          stroke="rgba(255,255,255,0.1)"
                          strokeDasharray="2 2"
                        />
                      );
                    })}

                    {/* Traditional line */}
                    <polyline
                      points={years
                        .map((year, index) => {
                          const x = (index / (years.length - 1)) * 100;
                          const y =
                            100 -
                            ((traditionalValues[index] - 100) /
                              (traditionalValues[years.length - 1] - 100)) *
                              100;
                          return `${x},${y}`;
                        })
                        .join(" ")}
                      fill="none"
                      stroke="#f87171"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />

                    {/* Holding line (animated) */}
                    <motion.path
                      d={`M0,100 L${chartLinePoints}`}
                      fill="none"
                      stroke="url(#chartGradient)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: activeYear / 10 }}
                      transition={{ duration: 0.5 }}
                    />

                    {/* Active year marker */}
                    <motion.circle
                      cx={((activeYear - 1) / (years.length - 1)) * 100}
                      cy={
                        100 -
                        ((holdingValues[activeYear - 1] - 100) /
                          (holdingValues[years.length - 1] - 100)) *
                          100
                      }
                      r="4"
                      fill="#fff"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [1, 0.8, 1],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                      }}
                    />

                    {/* Gradient definition */}
                    <defs>
                      <linearGradient
                        id="chartGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#0ea5e9" />
                        <stop offset="100%" stopColor="#2dd4bf" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Year labels */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between text-white/50 text-xs">
                    {years.map((year) => (
                      <div
                        key={year}
                        className={`${
                          activeYear === year ? "text-white font-medium" : ""
                        }`}
                      >
                        {year}
                      </div>
                    ))}
                  </div>

                  {/* Value labels */}
                  <div className="absolute top-0 left-0 bottom-0 flex flex-col justify-between items-start text-white/50 text-xs">
                    <div>+400%</div>
                    <div>+300%</div>
                    <div>+200%</div>
                    <div>+100%</div>
                    <div>Base</div>
                  </div>
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-sky-500 to-teal-500" />
                    <span className="text-white/80 text-sm">Holding</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-red-400" />
                    <span className="text-white/80 text-sm">Tradicional</span>
                  </div>
                </div>
              </div>

              {/* Year selector */}
              <div className="mt-6">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Ano:</span>
                  <span className="text-white font-medium">{activeYear}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={activeYear}
                  onChange={(e) =>
                    setActiveYear(Number.parseInt(e.target.value))
                  }
                  className="w-full mt-2 accent-teal-500"
                />
              </div>
            </div>

            <div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-teal-500 to-blue-500 p-3 rounded-xl">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Ano {activeYear}: Comparativo
                      </h3>
                      <p className="text-white/70">
                        No ano {activeYear}, seu patrimônio com uma holding
                        seria{" "}
                        <span className="text-teal-400 font-medium">
                          {percentageDiff}% maior
                        </span>{" "}
                        do que com uma estrutura tradicional.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-white/70 text-sm">
                          Estrutura Tradicional
                        </h4>
                        <div className="text-2xl font-bold text-white mt-1">
                          {traditionalValues[activeYear - 1].toLocaleString()}
                          <span className="text-sm text-white/50 ml-1">
                            mil
                          </span>
                        </div>
                      </div>
                      <div className="bg-red-400/20 p-2 rounded-lg">
                        <DollarSign className="w-5 h-5 text-red-400" />
                      </div>
                    </div>
                    <div className="mt-4 text-white/60 text-sm">
                      Crescimento de{" "}
                      {Math.round(
                        ((traditionalValues[activeYear - 1] - 100) / 100) * 100
                      )}
                      % desde o início
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-teal-900/40 to-blue-900/40 backdrop-blur-sm rounded-2xl p-6 border border-teal-500/20">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-teal-400/90 text-sm">Holding W1</h4>
                        <div className="text-2xl font-bold text-white mt-1">
                          {holdingValues[activeYear - 1].toLocaleString()}
                          <span className="text-sm text-white/50 ml-1">
                            mil
                          </span>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-teal-500 to-blue-500 p-2 rounded-lg">
                        <ArrowUpRight className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="mt-4 text-teal-400/80 text-sm">
                      Crescimento de{" "}
                      {Math.round(
                        ((holdingValues[activeYear - 1] - 100) / 100) * 100
                      )}
                      % desde o início
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Benefícios acumulados no Ano {activeYear}
                  </h3>
                  <ul className="space-y-3">
                    {[
                      `Economia fiscal de aproximadamente R$ ${Math.round(
                        (holdingValues[activeYear - 1] -
                          traditionalValues[activeYear - 1]) *
                          0.3
                      ).toLocaleString()} mil`,
                      `Proteção patrimonial contra ${
                        activeYear * 10
                      }% dos riscos empresariais`,
                      `Planejamento sucessório otimizado em ${Math.min(
                        100,
                        activeYear * 15
                      )}%`,
                      activeYear >= 5
                        ? "Diversificação completa de investimentos"
                        : "Diversificação parcial de investimentos",
                    ].map((benefit, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-white/80"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
