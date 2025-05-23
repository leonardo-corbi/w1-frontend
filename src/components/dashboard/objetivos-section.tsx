"use client";

import { useState } from "react";
import type { Objetivo } from "@/types/Objetivo";
import { objetivoAPI } from "@/lib/api";
import {
  formatCurrency,
  formatDate,
  getCategoriaLabel,
  getStatusLabel,
} from "@/lib/utils";
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
import { Textarea } from "@/components/ui/textarea";
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
import { Target, Plus, Pencil, Trash2 } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ObjetivosSectionProps {
  objetivos: Objetivo[];
  fetchObjetivos: () => Promise<void>;
}

const objetivoFormSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  categoria: z.string().min(1, "Categoria é obrigatória"),
  valor_alvo: z.string().min(1, "Valor alvo é obrigatório"),
  valor_atual: z.string().optional(),
  data_alvo: z.string().min(1, "Data alvo é obrigatória"),
  aporte_mensal: z.string().optional(),
  prioridade: z.string().min(1, "Prioridade é obrigatória"),
  status: z.string().min(1, "Status é obrigatório"),
});

type ObjetivoFormValues = z.infer<typeof objetivoFormSchema>;

export function ObjetivosSection({
  objetivos,
  fetchObjetivos,
}: ObjetivosSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingObjetivo, setEditingObjetivo] = useState<Objetivo | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const form = useForm<ObjetivoFormValues>({
    resolver: zodResolver(objetivoFormSchema),
    defaultValues: {
      titulo: "",
      descricao: "",
      categoria: "",
      valor_alvo: "",
      valor_atual: "",
      data_alvo: "",
      aporte_mensal: "",
      prioridade: "media",
      status: "pending",
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      const formattedData = {
        ...data,
        valor_alvo: Number.parseFloat(data.valor_alvo || "0").toFixed(2),
        valor_atual: Number.parseFloat(data.valor_atual || "0").toFixed(2),
        aporte_mensal: Number.parseFloat(data.aporte_mensal || "0").toFixed(2),
      };

      if (editingObjetivo) {
        await objetivoAPI.update(editingObjetivo.id, formattedData);
        setFormSuccess("Objetivo atualizado com sucesso!");
      } else {
        await objetivoAPI.create(formattedData);
        setFormSuccess("Objetivo adicionado com sucesso!");
      }

      await fetchObjetivos();

      setTimeout(() => {
        setIsDialogOpen(false);
        resetForm();
        setFormSuccess(null);
      }, 1500);
    } catch (error) {
      console.error("Erro ao salvar objetivo:", error);
      setFormError("Ocorreu um erro ao salvar o objetivo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditObjetivo = (objetivo: Objetivo) => {
    setEditingObjetivo(objetivo);
    form.reset({
      titulo: objetivo.titulo,
      descricao: objetivo.descricao,
      categoria: objetivo.categoria,
      valor_alvo: objetivo.valor_alvo,
      valor_atual: objetivo.valor_atual,
      data_alvo: objetivo.data_alvo,
      aporte_mensal: objetivo.aporte_mensal,
      prioridade: objetivo.prioridade,
      status: objetivo.status,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteObjetivo = async (id: string) => {
    try {
      await objetivoAPI.delete(id);
      await fetchObjetivos();
    } catch (error) {
      console.error("Erro ao excluir objetivo:", error);
    }
  };

  const resetForm = () => {
    form.reset({
      titulo: "",
      descricao: "",
      categoria: "",
      valor_alvo: "",
      valor_atual: "",
      data_alvo: "",
      aporte_mensal: "",
      prioridade: "media",
      status: "pending",
    });
    setEditingObjetivo(null);
  };

  const handleOpenDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  // Group objetivos by categoria
  const groupedObjetivos = objetivos.reduce(
    (acc: { [key: string]: Objetivo[] }, objetivo) => {
      const categoria = objetivo.categoria || "Sem Categoria";
      acc[categoria] = acc[categoria] || [];
      acc[categoria].push(objetivo);
      return acc;
    },
    {}
  );

  // Calculate progress for an objetivo
  const calculateProgress = (objetivo: Objetivo) => {
    const valorAtual = Number.parseFloat(objetivo.valor_atual || "0");
    const valorAlvo = Number.parseFloat(objetivo.valor_alvo || "0");
    if (valorAlvo === 0) return 0;
    return Math.min(Math.round((valorAtual / valorAlvo) * 100), 100);
  };

  // Adicionar o componente de alerta no formulário
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-navy-300">Gerencie seus objetivos financeiros</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleOpenDialog}
              className="bg-navy-600 hover:bg-navy-700 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Objetivo
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-navy-800 border-navy-700 text-white max-h-[90vh] overflow-y-auto bg-slate-400">
            <DialogHeader>
              <DialogTitle>
                {editingObjetivo ? "Editar Objetivo" : "Novo Objetivo"}
              </DialogTitle>
              <DialogDescription className="text-navy-300">
                {editingObjetivo
                  ? "Edite os detalhes do seu objetivo financeiro."
                  : "Adicione um novo objetivo financeiro ao seu planejamento."}
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
                  name="titulo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Título do objetivo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="descricao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva seu objetivo"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="categoria"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="retirement">
                            Aposentadoria
                          </SelectItem>
                          <SelectItem value="travel">Viagem</SelectItem>
                          <SelectItem value="real_estate">Imóvel</SelectItem>
                          <SelectItem value="vehicle">Veículo</SelectItem>
                          <SelectItem value="education">Educação</SelectItem>
                          <SelectItem value="health">Saúde</SelectItem>
                          <SelectItem value="business">Negócio</SelectItem>
                          <SelectItem value="other">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="valor_alvo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor Alvo (R$)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="valor_atual"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor Atual (R$)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="data_alvo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data Alvo</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="aporte_mensal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aporte Mensal (R$)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="prioridade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prioridade</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a prioridade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="baixa">Baixa</SelectItem>
                            <SelectItem value="media">Média</SelectItem>
                            <SelectItem value="alta">Alta</SelectItem>
                          </SelectContent>
                        </Select>
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
                            <SelectItem value="processing">
                              Em Processo
                            </SelectItem>
                            <SelectItem value="completed">Concluído</SelectItem>
                          </SelectContent>
                        </Select>
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
                      : editingObjetivo
                      ? "Atualizar Objetivo"
                      : "Salvar Objetivo"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {Object.keys(groupedObjetivos).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedObjetivos).map(([categoria, items]) => (
            <Card key={categoria}>
              <CardHeader>
                <CardTitle>{getCategoriaLabel(categoria)}</CardTitle>
                <CardDescription>
                  {items.length} {items.length === 1 ? "objetivo" : "objetivos"}{" "}
                  registrados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((objetivo) => {
                    const progress = calculateProgress(objetivo);
                    return (
                      <div key={objetivo.id} className="rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{objetivo.titulo}</h3>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditObjetivo(objetivo)}
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
                                    objetivo? Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDeleteObjetivo(objetivo.id)
                                    }
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {objetivo.descricao}
                        </p>
                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Valor Alvo
                            </p>
                            <p className="font-medium">
                              {formatCurrency(objetivo.valor_alvo)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Data Alvo
                            </p>
                            <p className="font-medium">
                              {formatDate(objetivo.data_alvo)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Status
                            </p>
                            <p className="font-medium">
                              {getStatusLabel(objetivo.status)}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-xs">
                            <span>Progresso</span>
                            <span>{progress}%</span>
                          </div>
                          <Progress value={progress} className="mt-1" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Target className="h-10 w-10 text-muted-foreground" />
            <p className="mt-4 text-center text-muted-foreground">
              Nenhum objetivo cadastrado. Clique em "Adicionar Objetivo" para
              começar.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
