"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { objetivoAPI } from "@/lib/api";
import { toast } from "sonner";

interface Objetivo {
  id: string;
  titulo: string;
  valor_alvo: string;
  valor_atual: string;
}

interface UserObjectivesProps {
  userId: string;
}

export function UserObjectives({ userId }: UserObjectivesProps) {
  const [objetivos, setObjetivos] = useState<Objetivo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchObjetivos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log("UserObjectives: Fetching objectives for userId:", userId);
        const response = await objetivoAPI.getAll({ user_id: userId });
        console.log(
          "UserObjectives: API URL:",
          `/api/objetivo/?user_id=${userId}`
        );
        console.log("UserObjectives: Response data:", response.data);
        setObjetivos(response.data);
      } catch (err: any) {
        console.error("UserObjectives: Erro ao buscar objetivos:", err);
        setError("Erro ao carregar objetivos.");
        toast.error("Erro ao carregar objetivos.");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchObjetivos();
    } else {
      setError("ID de usuário inválido.");
      setIsLoading(false);
    }
  }, [userId]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Objetivos Financeiros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Objetivos Financeiros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Objetivos Financeiros</CardTitle>
      </CardHeader>
      <CardContent>
        {objetivos.length > 0 ? (
          <ul>
            {objetivos.map((objetivo) => (
              <li key={objetivo.id} className="mb-4">
                <div className="font-bold">{objetivo.titulo}</div>
                <div>Valor Alvo: {objetivo.valor_alvo}</div>
                <div>Valor Atual: {objetivo.valor_atual}</div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-6">Nenhum objetivo encontrado.</div>
        )}
      </CardContent>
    </Card>
  );
}
