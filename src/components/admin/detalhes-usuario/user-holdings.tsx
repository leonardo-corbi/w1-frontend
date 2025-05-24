"use client";

import { useState, useEffect } from "react";
import type { Holding } from "@/types/Holding";
import { holdingAPI } from "@/lib/api";
import { getStatusLabel, getStatusVariant } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Building2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface UserHoldingsProps {
  userId: string;
}

export function UserHoldings({ userId }: UserHoldingsProps) {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHoldings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("UserHoldings: Fetching holdings for userId:", userId);
      const response = await holdingAPI.getAll({ user_id: userId });
      console.log("UserHoldings: Response data:", response.data);
      setHoldings(response.data);
    } catch (err: any) {
      console.error("UserHoldings: Error fetching holdings:", err);
      setError("Ocorreu um erro ao carregar as holdings.");
      toast.error("Erro ao carregar holdings.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchHoldings();
    } else {
      setError("ID de usuário inválido.");
      setIsLoading(false);
    }
  }, [userId]);

  const handleStatusChange = async (
    holdingId: string,
    newStatus: Holding["status"]
  ) => {
    try {
      console.log(
        "UserHoldings: Updating holding id:",
        holdingId,
        "to status:",
        newStatus
      );
      const holding = holdings.find((h) => h.id === holdingId);
      if (!holding) throw new Error("Holding não encontrada");

      // Clean CNPJ by removing non-digit characters
      const cleanedCnpj = holding.cnpj.replace(/\D/g, "");
      await holdingAPI.update(holdingId, {
        nome_holding: holding.nome_holding,
        cnpj: cleanedCnpj,
        status: newStatus,
      });

      // Re-fetch holdings to ensure UI is in sync with server
      await fetchHoldings();
      toast.success("Status da holding atualizado com sucesso!");
    } catch (err: any) {
      console.error("UserHoldings: Error updating status:", err);
      const errorMessage =
        err.response?.data?.detail ||
        err.message ||
        "Ocorreu um erro ao atualizar o status da holding.";
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-destructive">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Holdings</CardTitle>
      </CardHeader>
      <CardContent>
        {holdings.length > 0 ? (
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Nome da Holding</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holdings.map((holding) => (
                <TableRow key={holding.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    {holding.nome_holding}
                  </TableCell>
                  <TableCell>{holding.cnpj}</TableCell>
                  <TableCell className="text-right">
                    <Select
                      value={holding.status}
                      onValueChange={(value: Holding["status"]) =>
                        handleStatusChange(holding.id, value)
                      }
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Alterar status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="approved">Aprovado</SelectItem>
                        <SelectItem value="rejected">Rejeitado</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 font-medium text-foreground">
              Nenhuma holding cadastrada
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Este usuário não possui holdings registradas.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
