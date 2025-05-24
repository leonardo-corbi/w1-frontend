"use client";

import { useState } from "react";
import type { Objetivo } from "@/types/Objetivo"; // Assuming path is correct
import { objetivoAPI } from "@/lib/api"; // Assuming path is correct
import {
  formatCurrency,
  formatDate,
  getCategoriaLabel,
  getStatusLabel,
  getPrioridadeLabel,
  getPrioridadeVariant,
  getStatusVariant,
} from "@/lib/utils"; // Assuming path is correct
import { Button } from "@/components/ui/button"; // Assuming path is correct
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Assuming path is correct
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"; // Assuming path is correct
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"; // Assuming path is correct
import { Input } from "@/components/ui/input"; // Assuming path is correct
import { Textarea } from "@/components/ui/textarea"; // Assuming path is correct
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Assuming path is correct
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Target, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
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
} from "@/components/ui/alert-dialog"; // Assuming path is correct
import { Progress } from "@/components/ui/progress"; // Assuming path is correct
import { Badge } from "@/components/ui/badge"; // Assuming path is correct
import { ScrollArea } from "@/components/ui/scroll-area"; // Assuming path is correct
import { toast } from "sonner"; // Use sonner for feedback

interface ObjetivosSectionProps {
  objetivos: Objetivo[];
  fetchObjetivos: () => Promise<void>;
}

// Refined Zod schema with better error messages and coercion
const objetivoFormSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  categoria: z.string().min(1, "Categoria é obrigatória"),
  valor_alvo: z.coerce
    .number({
      required_error: "Valor alvo é obrigatório",
      invalid_type_error: "Valor alvo deve ser um número",
    })
    .min(0.01, "Valor alvo deve ser maior que zero"),
  valor_atual: z.coerce
    .number({
      invalid_type_error: "Valor atual deve ser um número",
    })
    .min(0, "Valor atual não pode ser negativo")
    .optional(),
  data_alvo: z.string().min(1, "Data alvo é obrigatória"),
  aporte_mensal: z.coerce
    .number({
      invalid_type_error: "Aporte mensal deve ser um número",
    })
    .min(0, "Aporte mensal não pode ser negativo")
    .optional(),
  prioridade: z.enum(["baixa", "media", "alta"], {
    required_error: "Prioridade é obrigatória",
  }),
  status: z.enum(["pending", "processing", "completed"], {
    required_error: "Status é obrigatório",
  }),
});

type ObjetivoFormValues = z.infer<typeof objetivoFormSchema>;

export function ObjetivosSection({
  objetivos,
  fetchObjetivos,
}: ObjetivosSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingObjetivo, setEditingObjetivo] = useState<Objetivo | null>(null);

  const form = useForm<ObjetivoFormValues>({
    resolver: zodResolver(objetivoFormSchema),
    defaultValues: {
      titulo: "",
      descricao: "",
      categoria: "",
      valor_alvo: 0,
      valor_atual: 0,
      data_alvo: "",
      aporte_mensal: 0,
      prioridade: "media",
      status: "pending",
    },
  });

  const onSubmit = async (data: ObjetivoFormValues) => {
    setIsSubmitting(true);
    try {
      const payload: Partial<Objetivo> = {
        ...data,
        categoria: data.categoria as Objetivo["categoria"],
        valor_alvo: data.valor_alvo.toString(),
        valor_atual: (data.valor_atual ?? 0).toString(),
        aporte_mensal: (data.aporte_mensal ?? 0).toString(),
      };

      if (editingObjetivo) {
        await objetivoAPI.update(editingObjetivo.id, payload);
        toast.success("Objetivo atualizado com sucesso!");
      } else {
        await objetivoAPI.create(payload);
        toast.success("Objetivo adicionado com sucesso!");
      }

      await fetchObjetivos();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar objetivo:", error);
      toast.error("Ocorreu um erro ao salvar o objetivo.");
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
      valor_alvo: Number(objetivo.valor_alvo || 0),
      valor_atual: Number(objetivo.valor_atual || 0),
      data_alvo: objetivo.data_alvo ? objetivo.data_alvo.split("T")[0] : "", // Format date for input
      aporte_mensal: Number(objetivo.aporte_mensal || 0),
      prioridade: objetivo.prioridade as "baixa" | "media" | "alta",
      status: objetivo.status as "pending" | "processing" | "completed",
    });
    setIsDialogOpen(true);
  };

  const handleDeleteObjetivo = async (id: string) => {
    try {
      await objetivoAPI.delete(id);
      await fetchObjetivos();
      toast.success("Objetivo excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir objetivo:", error);
      toast.error("Ocorreu um erro ao excluir o objetivo.");
    }
  };

  const resetForm = () => {
    form.reset({
      titulo: "",
      descricao: "",
      categoria: "",
      valor_alvo: 0,
      valor_atual: 0,
      data_alvo: "",
      aporte_mensal: 0,
      prioridade: "media",
      status: "pending",
    });
    setEditingObjetivo(null);
  };

  const handleOpenDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  // Calculate progress for an objetivo
  const calculateProgress = (objetivo: Objetivo) => {
    const valorAtual = Number.parseFloat(objetivo.valor_atual || "0");
    const valorAlvo = Number.parseFloat(objetivo.valor_alvo || "0");
    if (valorAlvo <= 0) return 0;
    return Math.min(Math.round((valorAtual / valorAlvo) * 100), 100);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Section Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            Objetivos Financeiros
          </h1>
          <p className="text-muted-foreground">
            Planeje e acompanhe suas metas financeiras.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Objetivo
            </Button>
          </DialogTrigger>
          {/* Use ScrollArea inside DialogContent for long forms */}
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingObjetivo ? "Editar Objetivo" : "Novo Objetivo"}
              </DialogTitle>
              <DialogDescription>
                {editingObjetivo
                  ? "Edite os detalhes do seu objetivo financeiro."
                  : "Adicione um novo objetivo financeiro ao seu planejamento."}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh]">
              <div className="pr-6 py-4">
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
                            <Input
                              placeholder="Ex: Viagem para Europa"
                              {...field}
                            />
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
                              placeholder="Descreva seu objetivo em detalhes"
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
                              <SelectItem value="real_estate">
                                Imóvel
                              </SelectItem>
                              <SelectItem value="vehicle">Veículo</SelectItem>
                              <SelectItem value="education">
                                Educação
                              </SelectItem>
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
                              <Input
                                type="number"
                                min="0.01"
                                step="0.01"
                                placeholder="10000,00"
                                {...field}
                              />
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
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0,00"
                                {...field}
                              />
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
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0,00"
                                {...field}
                              />
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
                                <SelectItem value="pending">
                                  Pendente
                                </SelectItem>
                                <SelectItem value="processing">
                                  Em Andamento
                                </SelectItem>
                                <SelectItem value="completed">
                                  Concluído
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <DialogFooter className="pt-4">
                      <DialogClose asChild>
                        <Button type="button" variant="outline">
                          Cancelar
                        </Button>
                      </DialogClose>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {isSubmitting
                          ? "Salvando..."
                          : editingObjetivo
                          ? "Atualizar Objetivo"
                          : "Salvar Objetivo"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      {/* Objetivos List - Refined Card Layout */}
      {objetivos.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {objetivos.map((objetivo) => {
            const progress = calculateProgress(objetivo);
            return (
              <Card key={objetivo.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-lg font-semibold text-foreground">
                        {objetivo.titulo}
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        {getCategoriaLabel(objetivo.categoria)} | Meta:
                        {formatDate(objetivo.data_alvo)}
                      </CardDescription>
                    </div>
                    <div className="flex flex-shrink-0 gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleEditObjetivo(objetivo)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
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
                              Tem certeza que deseja excluir o objetivo
                              {objetivo.titulo}? Esta ação não pode ser
                              desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteObjetivo(objetivo.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {objetivo.descricao}
                  </p>
                  <div>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-medium text-foreground">
                        Progresso ({progress}%)
                      </span>
                      <span className="text-muted-foreground">
                        {formatCurrency(objetivo.valor_atual || "0")} /
                        {formatCurrency(objetivo.valor_alvo)}
                      </span>
                    </div>
                    <Progress
                      value={progress}
                      aria-label={`${progress}% concluído`}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-4 border-t">
                  <Badge variant={getPrioridadeVariant(objetivo.prioridade)}>
                    {getPrioridadeLabel(objetivo.prioridade)}
                  </Badge>
                  <Badge variant={getStatusVariant(objetivo.status)}>
                    {getStatusLabel(objetivo.status)}
                  </Badge>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Target className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 font-medium text-foreground">
              Nenhum objetivo cadastrado
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Clique em Adicionar Objetivo para começar a planejar.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
