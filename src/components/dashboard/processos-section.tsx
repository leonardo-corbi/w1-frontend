"use client";

import { useState } from "react";
import type { Processo } from "@/types/Processo";
import type { Holding } from "@/types/Holding";
import { processoAPI } from "@/lib/api";
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
import { GitPullRequest, Plus, Pencil, Trash2 } from "lucide-react";
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

// Define the types for the props and form values
type ProcessosSectionProps = {
  processos: Processo[];
  holdings: Holding[];
  fetchProcessos: () => Promise<void>;
};

type ProcessoFormValues = {
  holding_id: string;
  etapa: string;
  status: string;
  data_inicio: string;
  data_fim?: string;
};

// Define the schema for the form
const processoFormSchema = z.object({
  holding_id: z.string(),
  etapa: z.string(),
  status: z.string(),
  data_inicio: z.string(),
  data_fim: z.string().optional(),
});

// Atualizar a função ProcessosSection para remover toast e adicionar feedback inline
export function ProcessosSection({
  processos,
  holdings,
  fetchProcessos,
}: ProcessosSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProcesso, setEditingProcesso] = useState<Processo | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  const form = useForm<ProcessoFormValues>({
    resolver: zodResolver(processoFormSchema),
    defaultValues: {
      holding_id: holdings.length > 0 ? holdings[0].id : "",
      etapa: "",
      status: "pending",
      data_inicio: "",
      data_fim: "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      if (editingProcesso) {
        await processoAPI.update(editingProcesso.id, data);
        setFormSuccess("Processo atualizado com sucesso!");
      } else {
        await processoAPI.create(data);
        setFormSuccess("Processo adicionado com sucesso!");
      }

      await fetchProcessos();

      setTimeout(() => {
        setIsDialogOpen(false);
        resetForm();
        setFormSuccess(null);
      }, 1500);
    } catch (error) {
      console.error("Erro ao salvar processo:", error);
      setFormError("Ocorreu um erro ao salvar o processo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProcesso = async (id: string) => {
    try {
      await processoAPI.delete(id);
      await fetchProcessos();
      setDeleteSuccess("Processo excluído com sucesso!");

      setTimeout(() => {
        setDeleteSuccess(null);
      }, 3000);
    } catch (error) {
      console.error("Erro ao excluir processo:", error);
      setFormError("Ocorreu um erro ao excluir o processo.");

      setTimeout(() => {
        setFormError(null);
      }, 3000);
    }
  };

  const resetForm = () => {
    form.reset({
      holding_id: holdings.length > 0 ? holdings[0].id : "",
      etapa: "",
      status: "pending",
      data_inicio: "",
      data_fim: "",
    });
    setEditingProcesso(null);
  };

  const handleOpenDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEditProcesso = (processo: Processo) => {
    setEditingProcesso(processo);
    form.setValue("holding_id", processo.holding_id);
    form.setValue("etapa", processo.etapa);
    form.setValue("status", processo.status);
    form.setValue("data_inicio", processo.data_inicio);
    form.setValue("data_fim", processo.data_fim || "");
    setIsDialogOpen(true);
  };

  const getHoldingName = (holdingId: string) => {
    const holding = holdings.find((h) => h.id === holdingId);
    return holding ? holding.nome_holding : "N/A";
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "progress":
        return "default";
      default:
        return "secondary";
    }
  };

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
          <p className="text-navy-300">Gerencie seus processos empresariais</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleOpenDialog}
              disabled={holdings.length === 0}
              className="bg-navy-600 hover:bg-navy-700 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Processo
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-navy-800 border-navy-700 text-white bg-slate-500">
            <DialogHeader>
              <DialogTitle>
                {editingProcesso ? "Editar Processo" : "Novo Processo"}
              </DialogTitle>
              <DialogDescription className="text-navy-300">
                {editingProcesso
                  ? "Edite os detalhes do seu processo."
                  : "Adicione um novo processo ao seu portfólio."}
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
                <FormField
                  control={form.control}
                  name="etapa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Etapa</FormLabel>
                      <FormControl>
                        <Input placeholder="Etapa do processo" {...field} />
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
                          <SelectItem value="progress">Em Progresso</SelectItem>
                          <SelectItem value="completed">Concluído</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="data_inicio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Início</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="data_fim"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Fim (opcional)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    className="text-black"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? "Salvando..."
                      : editingProcesso
                      ? "Atualizar Processo"
                      : "Salvar Processo"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {processos.length > 0 ? (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Seus Processos</CardTitle>
              <CardDescription>
                Lista de todos os processos cadastrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left font-medium">
                        Holding
                      </th>
                      <th className="px-4 py-2 text-left font-medium">Etapa</th>
                      <th className="px-4 py-2 text-left font-medium">
                        Status
                      </th>
                      <th className="px-4 py-2 text-left font-medium">
                        Data de Início
                      </th>
                      <th className="px-4 py-2 text-left font-medium">
                        Data de Fim
                      </th>
                      <th className="px-4 py-2 text-left font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processos.map((processo) => (
                      <tr key={processo.id} className="border-b">
                        <td className="px-4 py-2">
                          {getHoldingName(processo.holding_id)}
                        </td>
                        <td className="px-4 py-2">{processo.etapa}</td>
                        <td className="px-4 py-2">
                          <Badge>{getStatusLabel(processo.status)}</Badge>
                        </td>
                        <td className="px-4 py-2">
                          {formatDate(processo.data_inicio)}
                        </td>
                        <td className="px-4 py-2">
                          {processo.data_fim
                            ? formatDate(processo.data_fim)
                            : "N/A"}
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditProcesso(processo)}
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
                                    processo? Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDeleteProcesso(processo.id)
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
            <GitPullRequest className="h-10 w-10 text-muted-foreground" />
            <p className="mt-4 text-center text-muted-foreground">
              {holdings.length === 0
                ? "Você precisa cadastrar uma holding antes de adicionar processos."
                : 'Nenhum processo cadastrado. Clique em "Adicionar Processo" para começar.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
