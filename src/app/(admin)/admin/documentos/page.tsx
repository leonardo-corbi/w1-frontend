"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { DocumentTable } from "@/components/documentos/DocumentTable";
import { DocumentFilters } from "@/components/documentos/DocumentFilters";

export default function DocumentosPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    status: "pending",
    tipo: "all",
    dataInicio: "",
    dataFim: "",
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-w1-dark">
          Validação de Documentos
        </h1>
        <div className="flex gap-2">
          <Button className="bg-w1-green hover:bg-w1-green-dark text-white">
            Aprovar Selecionados
          </Button>
          <Button
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-50"
          >
            Rejeitar Selecionados
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-w1-gray h-4 w-4" />
          <Input
            placeholder="Buscar por nome, tipo ou usuário..."
            className="pl-10 border-w1-gray-light focus:border-w1-green focus:ring-w1-green"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DocumentFilters filters={filters} setFilters={setFilters} />
      </div>

      <DocumentTable searchQuery={searchQuery} filters={filters} />
    </div>
  );
}
