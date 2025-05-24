"use client";

import { useState, useEffect } from "react";
import type { Documento } from "@/types/Documento";
import type { Holding } from "@/types/Holding";
import { documentoAPI, holdingAPI } from "@/lib/api";
import { formatDate, getStatusLabel, getStatusVariant } from "@/lib/utils";
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
import { Button } from "@/components/ui/button";
import { FileText, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface UserDocumentsProps {
  userId: string;
}

export function UserDocuments({ userId }: UserDocumentsProps) {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log(
        "UserDocuments: Fetching documents and holdings for userId:",
        userId
      );
      const [docResponse, holdingResponse] = await Promise.all([
        documentoAPI.getAll({ user_id: userId }),
        holdingAPI.getAll({ user_id: userId }),
      ]);
      console.log("UserDocuments: Documents response:", docResponse.data);
      console.log("UserDocuments: Holdings response:", holdingResponse.data);
      setDocumentos(docResponse.data);
      setHoldings(holdingResponse.data);
    } catch (err: any) {
      console.error("UserDocuments: Error fetching data:", err);
      setError("Ocorreu um erro ao carregar os documentos.");
      toast.error("Erro ao carregar documentos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchData();
    } else {
      setError("ID de usuário inválido.");
      setIsLoading(false);
    }
  }, [userId]);

  const handleStatusChange = async (
    docId: string,
    newStatus: Documento["status"]
  ) => {
    try {
      console.log(
        "UserDocuments: Updating document id:",
        docId,
        "to status:",
        newStatus
      );
      const doc = documentos.find((d) => d.id === docId);
      if (!doc) throw new Error("Documento não encontrado");

      // Use the new updateStatus method for status-only updates
      await documentoAPI.updateStatus(docId, newStatus);

      // Re-fetch documents to ensure UI is in sync with server
      await fetchData();
      toast.success("Status do documento atualizado com sucesso!");
    } catch (err: any) {
      console.error("UserDocuments: Error updating status:", err);
      const errorMessage =
        err.response?.data?.detail ||
        err.message ||
        "Ocorreu um erro ao atualizar o status do documento.";
      toast.error(errorMessage);
    }
  };

  const getHoldingName = (holdingId: string) => {
    const holding = holdings.find((h) => h.id === holdingId);
    return holding ? holding.nome_holding : "N/A";
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Documentos</CardTitle>
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
          <CardTitle>Documentos</CardTitle>
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
        <CardTitle>Documentos</CardTitle>
      </CardHeader>
      <CardContent>
        {documentos.length > 0 ? (
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Holding</TableHead>{" "}
                {/* Added to match holding name column */}
                <TableHead>Status</TableHead>
                <TableHead>Data de Envio</TableHead>
                <TableHead>Arquivo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documentos.map((documento) => (
                <TableRow key={documento.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    {documento.tipo_documento}
                  </TableCell>
                  <TableCell>{getHoldingName(documento.holding_id)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusVariant(
                        documento.status === "pending"
                          ? "pending"
                          : documento.status === "sent"
                          ? "processing"
                          : documento.status === "approved"
                          ? "completed"
                          : documento.status === "rejected"
                          ? "processing"
                          : "pending"
                      )}
                    >
                      {getStatusLabel(documento.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(documento.data_envio)}</TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      size="sm"
                      asChild
                      className="p-0 h-auto"
                    >
                      <a
                        href={documento.url_arquivo}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-1 h-3 w-3" />
                        Visualizar
                      </a>
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <Select
                      value={documento.status}
                      onValueChange={(value: Documento["status"]) =>
                        handleStatusChange(documento.id, value)
                      }
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Alterar status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="sent">Enviado</SelectItem>
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
            <FileText className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 font-medium text-foreground">
              Nenhum documento cadastrado
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Este usuário não possui documentos registrados.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
