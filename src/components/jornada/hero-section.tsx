"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { WarpBackground } from "@/components/magicui/warp-background";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Shield, TrendingUp } from "lucide-react";

export function HeroSection() {
  const [typedText, setTypedText] = useState("");
  const fullText = "Transforme seu patrimônio com a W1 Holdings";
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (typedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length + 1));
      }, 50);
      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [typedText, fullText]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <WarpBackground
        className="pointer-events-none absolute inset-0 w-full h-full !rounded-none !border-0 p-0"
        perspective={200}
        beamsPerSide={4}
        beamSize={6}
      >
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none py-82 px-2 lg:py-0 lg:px-0">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="relative backdrop-blur-sm bg-gradient-to-b from-black/80 to-black/60 rounded-3xl px-8 py-12 w-full max-w-4xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center text-center mt-24 md:mt-32 lg:mt-160 pointer-events-auto"
          >
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white border-0 px-4 py-1 text-sm font-medium">
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                Novo
              </Badge>
            </div>

            <motion.div variants={itemVariants} className="relative">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
                {typedText}
                {!isComplete && <span className="animate-pulse">|</span>}
              </h1>
            </motion.div>

            <motion.div variants={itemVariants}>
              <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto font-sans">
                Abertura e gestão de holdings simplificadas para proteger e
                potencializar seu patrimônio com tecnologia de ponta.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white border-0 transition-all duration-300 transform hover:scale-105"
                >
                  Iniciar agora
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-6 mt-10"
            >
              <div className="flex items-center text-white/70">
                <Shield className="w-5 h-5 mr-2 text-emerald-400" />
                <span>Proteção patrimonial</span>
              </div>
              <div className="flex items-center text-white/70">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
                <span>Otimização tributária</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </WarpBackground>
    </section>
  );
}
