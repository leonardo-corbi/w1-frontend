"use client";

import { useState, useEffect, Suspense } from "react";
// Remove DashboardHeader import as it's handled by Navigation/Layout
// import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Overview } from "@/components/dashboard/overview"; // Assuming path is correct
import { PatrimoniosSection } from "@/components/dashboard/patrimonios-section"; // Assuming path is correct
import { ObjetivosSection } from "@/components/dashboard/objetivos-section"; // Assuming path is correct
import { DocumentosSection } from "@/components/dashboard/documentos-section"; // Assuming path is correct
import { HoldingsSection } from "@/components/dashboard/holdings-section"; // Assuming path is correct
import type { CustomUser } from "@/types/CustomUser"; // Assuming path is correct
import type { Patrimonio } from "@/types/Patrimonio"; // Assuming path is correct
import type { Objetivo } from "@/types/Objetivo"; // Assuming path is correct
import type { Holding } from "@/types/Holding"; // Assuming path is correct
import type { Documento } from "@/types/Documento"; // Assuming path is correct
import type { Notificacao } from "@/types/Notificacao"; // Assuming path is correct
import {
  authAPI,
  patrimonioAPI,
  objetivoAPI,
  holdingAPI,
  documentoAPI,
  notificacaoAPI,
} from "@/lib/api"; // Assuming path is correct
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming path is correct
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert components
import { Button } from "@/components/ui/button"; // Import Button

// Loading Skeleton Component (Refined)
function DashboardSkeleton() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="text-lg text-muted-foreground">
          Carregando dashboard...
        </span>
      </div>
    </div>
  );
}

// Error State Component (Refined)
function DashboardErrorState({ error }: { error: string }) {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background p-6">
      <Alert variant="destructive" className="max-w-md">
        <AlertTitle>Erro ao Carregar Dashboard</AlertTitle>
        <AlertDescription className="mb-4">{error}</AlertDescription>
        <Button onClick={() => window.location.reload()} size="sm">
          Tentar Novamente
        </Button>
        {/* Optionally add a logout button here */}
      </Alert>
    </div>
  );
}

export default function DashboardPage() {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [patrimonios, setPatrimonios] = useState<Patrimonio[]>([]);
  const [objetivos, setObjetivos] = useState<Objetivo[]>([]);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview"); // TODO: Verify if needed or handled by Layout

  const tabs = [
    { id: "overview", label: "Visão Geral" },
    { id: "patrimonios", label: "Patrimônios" },
    { id: "objetivos", label: "Objetivos" },
    { id: "holdings", label: "Holdings" },
    { id: "documentos", label: "Documentos" },
  ];

  // Centralized fetch function to handle errors
  const fetchData = async <T,>(
    apiCall: () => Promise<{ data: T }>,
    setter: (data: T) => void,
    entityName: string
  ) => {
    try {
      const response = await apiCall();
      setter(response.data);
    } catch (err) {
      console.error(`Erro ao carregar ${entityName}:`, err);
      setError(
        `Não foi possível carregar ${entityName}. Tente novamente mais tarde.`
      );
      throw new Error(`Failed to fetch ${entityName}`);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        const userResponse = await authAPI.getProfile();
        setUser(userResponse.data);

        await Promise.all([
          fetchData(patrimonioAPI.getAll, setPatrimonios, "patrimônios"),
          fetchData(objetivoAPI.getAll, setObjetivos, "objetivos"),
          fetchData(holdingAPI.getAll, setHoldings, "holdings"),
          fetchData(documentoAPI.getAll, setDocumentos, "documentos"),
          fetchData(notificacaoAPI.getAll, setNotificacoes, "notificações"),
        ]);
      } catch (err) {
        console.error("Erro ao carregar dados iniciais:", err);
        if (!user) {
          setError(
            "Erro ao carregar dados do usuário. Verifique sua conexão e tente novamente."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Re-fetch functions
  const fetchPatrimonios = () =>
    fetchData(patrimonioAPI.getAll, setPatrimonios, "patrimônios");
  const fetchObjetivos = () =>
    fetchData(objetivoAPI.getAll, setObjetivos, "objetivos");
  const fetchHoldings = () =>
    fetchData(holdingAPI.getAll, setHoldings, "holdings");
  const fetchDocumentos = () =>
    fetchData(documentoAPI.getAll, setDocumentos, "documentos");;

  // The activeTab state might need to be lifted to the Layout/Navigation component
  // or received as a prop if the navigation component controls the view.
  // This example assumes the page still controls the active tab for now.
  // TODO: Adjust based on final Navigation implementation.

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return <DashboardErrorState error={error} />;
  }

  // Function to render content based on activeTab (assuming it's managed here)
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <Overview
            user={user}
            patrimonios={patrimonios}
            objetivos={objetivos}
            holdings={holdings}
            documentos={documentos}
            notificacoes={notificacoes}
          />
        );
      case "patrimonios":
        return (
          <PatrimoniosSection
            patrimonios={patrimonios}
            fetchPatrimonios={fetchPatrimonios}
          />
        );
      case "objetivos":
        return (
          <ObjetivosSection
            objetivos={objetivos}
            fetchObjetivos={fetchObjetivos}
          />
        );
      case "holdings":
        return (
          <HoldingsSection holdings={holdings} fetchHoldings={fetchHoldings} />
        );
      case "documentos":
        return (
          <DocumentosSection
            documentos={documentos}
            holdings={holdings}
            fetchDocumentos={fetchDocumentos}
          />
        );
      default:
        // Fallback to overview or show an error/empty state
        return (
          <Overview
            user={user}
            patrimonios={patrimonios}
            objetivos={objetivos}
            holdings={holdings}
            documentos={documentos}
            notificacoes={notificacoes}
          />
        );
    }
  };

  return (
    // Container with padding, rendered inside MainContent from Layout
    <div className="container mx-auto py-6 md:py-8 lg:py-10 px-10">
      <div className="mb-6 flex space-x-2 overflow-x-auto">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "outline"}
            className={cn(
              "px-4 py-2 text-sm font-medium",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground"
            )}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>
      {/* The DashboardHeader is removed. Title/User info is in Navigation */}
      {/* Render the active section's content */}
      {renderContent()}
    </div>
  );
}
