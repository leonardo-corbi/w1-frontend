"use client";

import type React from "react";
import { useState, useRef } from "react";
import type { Documento } from "@/types/Documento";
import type { Holding } from "@/types/Holding";
import { documentoAPI } from "@/lib/api";
import { formatDate, getStatusLabel, getStatusVariant } from "@/lib/utils";
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
  DialogClose,
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
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Upload,
  Loader2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface DocumentosSectionProps {
  documentos: Documento[];
  holdings: Holding[];
  fetchDocumentos: () => Promise<void>;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const documentoFormSchema = z.object({
  tipo_documento: z.string().min(1, "Tipo de documento é obrigatório"),
  holding_id: z.string().min(1, "Holding é obrigatória"),
});

type DocumentoFormValues = z.infer<typeof documentoFormSchema>;

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
  const [fileError, setFileError] = useState<string | null>(null);

  const form = useForm<DocumentoFormValues>({
    resolver: zodResolver(documentoFormSchema),
    defaultValues: {
      tipo_documento: "",
      holding_id: holdings.length > 0 ? holdings[0].id : "",
    },
  });

  const validateFile = (file: File | null): boolean => {
    setFileError(null);
    if (!file) {
      if (!editingDocumento) {
        setFileError("Por favor, selecione um arquivo.");
        return false;
      }
      return true; // File is optional when editing
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileError(
        `Arquivo muito grande (máximo ${MAX_FILE_SIZE / 1024 / 1024}MB).`
      );
      return false;
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setFileError(
        "Tipo de arquivo inválido (permitido: PDF, JPG, PNG, WEBP)."
      );
      return false;
    }

    return true;
  };

  const onSubmit = async (data: DocumentoFormValues) => {
    if (!validateFile(selectedFile)) {
      return;
    }

    setIsSubmitting(true);
    try {
      const documentoData: {
        tipo_documento: string;
        status: string;
        arquivo?: File;
        holding_id: string;
      } = {
        tipo_documento: data.tipo_documento,
        status: "pending",
        holding_id: data.holding_id,
      };

      if (selectedFile) {
        documentoData.arquivo = selectedFile;
      }

      if (editingDocumento) {
        await documentoAPI.update(editingDocumento.id, documentoData);
        toast.success("Documento atualizado com sucesso!");
      } else {
        if (!selectedFile) {
          throw new Error("Arquivo é obrigatório para novos documentos.");
        }
        await documentoAPI.create({ ...documentoData, arquivo: selectedFile });
        toast.success("Documento adicionado com sucesso!");
      }

      await fetchDocumentos();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar documento:", error);
      toast.error("Ocorreu um erro ao salvar o documento.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditDocumento = (documento: Documento) => {
    setEditingDocumento(documento);
    form.reset({
      tipo_documento: documento.tipo_documento,
      holding_id: documento.holding_id,
    });
    setSelectedFile(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsDialogOpen(true);
  };

  const handleDeleteDocumento = async (id: string) => {
    setIsSubmitting(true);
    try {
      await documentoAPI.delete(id);
      await fetchDocumentos();
      toast.success("Documento excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir documento:", error);
      toast.error("Ocorreu um erro ao excluir o documento.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    form.reset({
      tipo_documento: "",
      holding_id: holdings.length > 0 ? holdings[0].id : "",
    });
    setEditingDocumento(null);
    setSelectedFile(null);
    setFileError(null);
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
    validateFile(file);
  };

  const getHoldingName = (holdingId: string) => {
    const holding = holdings.find((h) => h.id === holdingId);
    return holding ? holding.nome_holding : "N/A";
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Section Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            Documentos
          </h1>
          <p className="text-muted-foreground">
            Gerencie os documentos associados às suas holdings.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenDialog} disabled={holdings.length === 0}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Documento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingDocumento ? "Editar Documento" : "Novo Documento"}
              </DialogTitle>
              <DialogDescription>
                {editingDocumento
                  ? "Edite os detalhes e/ou substitua o arquivo do documento."
                  : "Adicione um novo documento e associe-o a uma holding."}
              </DialogDescription>
            </DialogHeader>
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
                        <Input placeholder="Ex: Contrato Social" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="holding_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Associar à Holding</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={holdings.length === 0}
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
                <FormItem>
                  <FormLabel>Arquivo</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept={ALLOWED_FILE_TYPES.join(",")}
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    />
                  </FormControl>
                  <FormMessage>{fileError}</FormMessage>
                  {selectedFile && (
                    <p className="text-xs text-muted-foreground">
                      Selecionado: {selectedFile.name} (
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                  {editingDocumento && !selectedFile && (
                    <p className="text-xs text-muted-foreground">
                      Deixe em branco para manter o arquivo atual.
                    </p>
                  )}
                </FormItem>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isSubmitting || !!fileError}>
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
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

      <Card>
        <CardHeader>
          <CardTitle>Lista de Documentos</CardTitle>
          <CardDescription>
            Todos os documentos enviados e seus status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {documentos.length > 0 ? (
            <ScrollArea className="max-h-[60vh] w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Holding Associada</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data de Envio</TableHead>
                    <TableHead>Arquivo</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documentos.map((documento) => (
                    <TableRow key={documento.id}>
                      <TableCell className="font-medium">
                        {documento.tipo_documento}
                      </TableCell>
                      <TableCell>
                        {getHoldingName(documento.holding_id)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusVariant(
                            documento.status === "pending"
                              ? "pending"
                              : documento.status === "sent"
                              ? "processing"
                              : documento.status === "approved"
                              ? "completed"
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
                        <div className="flex justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEditDocumento(documento)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Excluir</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Confirmar Exclusão
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o documento "
                                  {documento.tipo_documento}"? Esta ação não
                                  pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <DialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteDocumento(documento.id)
                                  }
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </DialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 font-medium text-foreground">
                Nenhum documento cadastrado
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Clique em "Adicionar Documento" para começar.
              </p>
              {holdings.length === 0 && (
                <p className="mt-2 text-xs text-destructive">
                  (Você precisa cadastrar uma holding antes de adicionar
                  documentos)
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
