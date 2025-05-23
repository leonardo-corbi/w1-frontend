"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Overview } from "@/components/dashboard/overview";
import { PatrimoniosSection } from "@/components/dashboard/patrimonios-section";
import { ObjetivosSection } from "@/components/dashboard/objetivos-section";
import { DocumentosSection } from "@/components/dashboard/documentos-section";
import { HoldingsSection } from "@/components/dashboard/holdings-section";
import { ProcessosSection } from "@/components/dashboard/processos-section";
import { NotificacoesSection } from "@/components/dashboard/notificacoes-section";
import type { CustomUser } from "@/types/CustomUser";
import type { Patrimonio } from "@/types/Patrimonio";
import type { Objetivo } from "@/types/Objetivo";
import type { Holding } from "@/types/Holding";
import type { Documento } from "@/types/Documento";
import type { Processo } from "@/types/Processo";
import type { Notificacao } from "@/types/Notificacao";
import {
  authAPI,
  patrimonioAPI,
  objetivoAPI,
  holdingAPI,
  documentoAPI,
  processoAPI,
  notificacaoAPI,
} from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [patrimonios, setPatrimonios] = useState<Patrimonio[]>([]);
  const [objetivos, setObjetivos] = useState<Objetivo[]>([]);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await authAPI.getProfile();
        setUser(response.data);
        await Promise.all([
          fetchPatrimonios(),
          fetchObjetivos(),
          fetchHoldings(),
          fetchDocumentos(),
          fetchProcessos(),
          fetchNotificacoes(),
        ]);
      } catch (err) {
        console.error("Erro ao carregar dados do usuário:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const fetchPatrimonios = async () => {
    try {
      const response = await patrimonioAPI.getAll();
      setPatrimonios(response.data);
    } catch (err) {
      console.error("Erro ao carregar patrimônios:", err);
    }
  };

  const fetchObjetivos = async () => {
    try {
      const response = await objetivoAPI.getAll();
      setObjetivos(response.data);
    } catch (err) {
      console.error("Erro ao carregar objetivos:", err);
    }
  };

  const fetchHoldings = async () => {
    try {
      const response = await holdingAPI.getAll();
      setHoldings(response.data);
    } catch (err) {
      console.error("Erro ao carregar holdings:", err);
    }
  };

  const fetchDocumentos = async () => {
    try {
      const response = await documentoAPI.getAll();
      setDocumentos(response.data);
    } catch (err) {
      console.error("Erro ao carregar documentos:", err);
    }
  };

  const fetchProcessos = async () => {
    try {
      const response = await processoAPI.getAll();
      setProcessos(response.data);
    } catch (err) {
      console.error("Erro ao carregar processos:", err);
    }
  };

  const fetchNotificacoes = async () => {
    try {
      const response = await notificacaoAPI.getAll();
      setNotificacoes(response.data);
    } catch (err) {
      console.error("Erro ao carregar notificações:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-navy-950">
        <Loader2 className="h-8 w-8 animate-spin text-navy-300" />
        <span className="ml-2 text-lg text-white">Carregando dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 text-white bg-slate-800 p-12">
      <DashboardHeader
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notificacoes={notificacoes}
      />

      <main className="container py-6">
        {activeTab === "overview" && (
          <Overview
            user={user}
            patrimonios={patrimonios}
            objetivos={objetivos}
            holdings={holdings}
            documentos={documentos}
            processos={processos}
            notificacoes={notificacoes}
          />
        )}

        {activeTab === "patrimonios" && (
          <PatrimoniosSection
            patrimonios={patrimonios}
            fetchPatrimonios={fetchPatrimonios}
          />
        )}

        {activeTab === "objetivos" && (
          <ObjetivosSection
            objetivos={objetivos}
            fetchObjetivos={fetchObjetivos}
          />
        )}

        {activeTab === "holdings" && (
          <HoldingsSection holdings={holdings} fetchHoldings={fetchHoldings} />
        )}

        {activeTab === "documentos" && (
          <DocumentosSection
            documentos={documentos}
            holdings={holdings}
            fetchDocumentos={fetchDocumentos}
          />
        )}

        {activeTab === "processos" && (
          <ProcessosSection
            processos={processos}
            holdings={holdings}
            fetchProcessos={fetchProcessos}
          />
        )}

        {activeTab === "notificacoes" && (
          <NotificacoesSection
            notificacoes={notificacoes}
            fetchNotificacoes={fetchNotificacoes}
          />
        )}
      </main>
    </div>
  );
}
