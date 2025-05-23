"use client";

import type React from "react";

import { useState, useRef } from "react";
import type { Documento } from "@/types/Documento";
import type { Holding } from "@/types/Holding";
import { documentoAPI } from "@/lib/api";
import { formatDate, getStatusLabel } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FileText, Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DocumentosSectionProps {
  documentos: Documento[];
  holdings: Holding[];
  fetchDocumentos: () => Promise<void>;
}

const documentoFormSchema = z.object({
  tipo_documento: z.string().min(1, "Tipo de documento é obrigatório"),
  status: z.string().min(1, "Status é obrigatório"),
  holding_id: z.string().min(1, "Holding é obrigatória"),
});

type DocumentoFormValues = z.infer<typeof documentoFormSchema>;

// Atualizar a função DocumentosSection para remover toast e adicionar feedback inline
export function DocumentosSection({
  documentos,
  holdings,
  fetchDocumentos,
}: DocumentosSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingDocumento, setEditingDocumento] = useState<Documento | null>(
    null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  const form = useForm<DocumentoFormValues>({
    resolver: zodResolver(documentoFormSchema),
    defaultValues: {
      tipo_documento: "",
      status: "pending",
      holding_id: holdings.length > 0 ? holdings[0].id : "",
    },
  });

  const onSubmit = async (data: DocumentoFormValues) => {
    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      if (!selectedFile && !editingDocumento) {
        setFormError("Por favor, selecione um arquivo para upload.");
        setIsSubmitting(false);
        return;
      }

      if (editingDocumento) {
        await documentoAPI.update(editingDocumento.id, {
          tipo_documento: data.tipo_documento,
          status: data.status,
          arquivo: selectedFile || undefined,
          holding_id: data.holding_id,
        });
        setFormSuccess("Documento atualizado com sucesso!");
      } else {
        await documentoAPI.create({
          tipo_documento: data.tipo_documento,
          status: data.status,
          arquivo: selectedFile!,
          holding_id: data.holding_id,
        });
        setFormSuccess("Documento adicionado com sucesso!");
      }

      await fetchDocumentos();

      setTimeout(() => {
        setIsDialogOpen(false);
        resetForm();
        setFormSuccess(null);
      }, 1500);
    } catch (error) {
      console.error("Erro ao salvar documento:", error);
      setFormError("Ocorreu um erro ao salvar o documento.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditDocumento = (documento: Documento) => {
    setEditingDocumento(documento);
    form.reset({
      tipo_documento: documento.tipo_documento,
      status: documento.status,
      holding_id: documento.holding_id,
    });
    setSelectedFile(null);
    setIsDialogOpen(true);
  };

  const handleDeleteDocumento = async (id: string) => {
    try {
      await documentoAPI.delete(id);
      await fetchDocumentos();
      setDeleteSuccess("Documento excluído com sucesso!");

      setTimeout(() => {
        setDeleteSuccess(null);
      }, 3000);
    } catch (error) {
      console.error("Erro ao excluir documento:", error);
      setFormError("Ocorreu um erro ao excluir o documento.");

      setTimeout(() => {
        setFormError(null);
      }, 3000);
    }
  };

  const resetForm = () => {
    form.reset({
      tipo_documento: "",
      status: "pending",
      holding_id: holdings.length > 0 ? holdings[0].id : "",
    });
    setEditingDocumento(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleOpenDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const getHoldingName = (holdingId: string) => {
    const holding = holdings.find((h) => h.id === holdingId);
    return holding ? holding.nome_holding : "N/A";
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "destructive";
      case "sent":
        return "default";
      default:
        return "secondary";
    }
  };

  // Resto do código permanece o mesmo, apenas atualizando as cores e adicionando o alerta de feedback

  // Adicionar o componente de alerta no formulário e na página principal
  return (
    <div className="space-y-6">
      {deleteSuccess && (
        <Alert className="bg-green-900 border-green-800 text-green-100">
          <AlertDescription>{deleteSuccess}</AlertDescription>
        </Alert>
      )}

      {formError && !isDialogOpen && (
        <Alert className="bg-red-900 border-red-800 text-red-100">
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Documentos</h2>
          <p className="text-muted-foreground">
            Gerencie seus documentos empresariais
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenDialog} disabled={holdings.length === 0}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Documento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingDocumento ? "Editar Documento" : "Novo Documento"}
              </DialogTitle>
              <DialogDescription>
                {editingDocumento
                  ? "Edite os detalhes do seu documento."
                  : "Adicione um novo documento ao seu portfólio."}
              </DialogDescription>
            </DialogHeader>

            {formSuccess && (
              <Alert className="bg-green-900 border-green-800 text-green-100">
                <AlertDescription>{formSuccess}</AlertDescription>
              </Alert>
            )}

            {formError && (
              <Alert className="bg-red-900 border-red-800 text-red-100">
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="tipo_documento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Documento</FormLabel>
                      <FormControl>
                        <Input placeholder="Tipo de documento" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">Pendente</SelectItem>
                          <SelectItem value="sent">Enviado</SelectItem>
                          <SelectItem value="approved">Aprovado</SelectItem>
                          <SelectItem value="rejected">Rejeitado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="holding_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Holding</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a holding" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {holdings.map((holding) => (
                            <SelectItem key={holding.id} value={holding.id}>
                              {holding.nome_holding}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <FormLabel>Arquivo (PDF, JPEG, PNG - Máx 5MB)</FormLabel>
                  <Input
                    type="file"
                    accept=".pdf,image/jpeg,image/png"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="cursor-pointer"
                  />
                  {selectedFile && (
                    <p className="text-xs text-muted-foreground">
                      Arquivo selecionado: {selectedFile.name}
                    </p>
                  )}
                  {editingDocumento && !selectedFile && (
                    <p className="text-xs text-muted-foreground">
                      Arquivo atual será mantido se nenhum novo for selecionado.
                    </p>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? "Salvando..."
                      : editingDocumento
                      ? "Atualizar Documento"
                      : "Salvar Documento"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {documentos.length > 0 ? (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Seus Documentos</CardTitle>
              <CardDescription>
                Lista de todos os documentos cadastrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left font-medium">Tipo</th>
                      <th className="px-4 py-2 text-left font-medium">
                        Holding
                      </th>
                      <th className="px-4 py-2 text-left font-medium">
                        Status
                      </th>
                      <th className="px-4 py-2 text-left font-medium">
                        Data de Envio
                      </th>
                      <th className="px-4 py-2 text-left font-medium">
                        Arquivo
                      </th>
                      <th className="px-4 py-2 text-left font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documentos.map((documento) => (
                      <tr key={documento.id} className="border-b">
                        <td className="px-4 py-2">
                          {documento.tipo_documento}
                        </td>
                        <td className="px-4 py-2">
                          {getHoldingName(documento.holding_id)}
                        </td>
                        <td className="px-4 py-2">
                          <Badge>{getStatusLabel(documento.status)}</Badge>
                        </td>
                        <td className="px-4 py-2">
                          {formatDate(documento.data_envio)}
                        </td>
                        <td className="px-4 py-2">
                          <a
                            href={documento.url_arquivo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-primary hover:underline"
                          >
                            <ExternalLink className="mr-1 h-4 w-4" />
                            Visualizar
                          </a>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditDocumento(documento)}
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Excluir</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Confirmar exclusão
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir este
                                    documento? Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDeleteDocumento(documento.id)
                                    }
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <FileText className="h-10 w-10 text-muted-foreground" />
            <p className="mt-4 text-center text-muted-foreground">
              {holdings.length === 0
                ? "Você precisa cadastrar uma holding antes de adicionar documentos."
                : 'Nenhum documento cadastrado. Clique em "Adicionar Documento" para começar.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
