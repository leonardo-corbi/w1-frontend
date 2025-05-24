"use client";

import { useState, useRef } from "react";
import type { Patrimonio } from "@/types/Patrimonio";
import { patrimonioAPI } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  Home,
  Plus,
  Loader2,
  CheckCircle,
  XCircle,
  Trash2,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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

interface PatrimoniosSectionProps {
  patrimonios: Patrimonio[];
  fetchPatrimonios: () => Promise<void>;
}

const patrimonioFormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  tipo: z.string().min(1, "Tipo é obrigatório"),
  data_aquisicao: z.string().min(1, "Data de aquisição é obrigatória"),
  valor: z.coerce
    .number({
      required_error: "Valor é obrigatório",
      invalid_type_error: "Valor deve ser um número",
    })
    .min(0, "Valor deve ser maior ou igual a zero"),
});

type PatrimonioFormValues = z.infer<typeof patrimonioFormSchema>;

export function PatrimoniosSection({
  patrimonios,
  fetchPatrimonios,
}: PatrimoniosSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [patrimonioToDelete, setPatrimonioToDelete] =
    useState<Patrimonio | null>(null);

  const form = useForm<PatrimonioFormValues>({
    resolver: zodResolver(patrimonioFormSchema),
    defaultValues: {
      nome: "",
      tipo: "",
      data_aquisicao: "",
      valor: 0,
    },
  });

  const onSubmit = async (data: PatrimonioFormValues) => {
    setIsSubmitting(true);
    try {
      await patrimonioAPI.create(data);
      await fetchPatrimonios();
      toast.success("Patrimônio adicionado com sucesso!");
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error("Erro ao criar patrimônio:", error);
      toast.error("Ocorreu um erro ao adicionar o patrimônio.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsSubmitting(true);
    try {
      await patrimonioAPI.delete(id);
      await fetchPatrimonios();
      toast.success("Patrimônio excluído com sucesso!");
      setIsDeleteDialogOpen(false);
      setPatrimonioToDelete(null);
    } catch (error) {
      console.error("Erro ao excluir patrimônio:", error);
      toast.error("Ocorreu um erro ao excluir o patrimônio.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Group patrimonios by type
  const groupedPatrimonios = patrimonios.reduce(
    (acc: { [key: string]: Patrimonio[] }, patrimonio) => {
      const tipo = patrimonio.tipo || "Outro";
      acc[tipo] = acc[tipo] || [];
      acc[tipo].push(patrimonio);
      return acc;
    },
    {}
  );

  // Calculate total value
  const totalValue = patrimonios.reduce(
    (total, patrimonio) => total + (patrimonio.valor || 0),
    0
  );

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Section Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            Patrimônios
          </h1>
          <p className="text-muted-foreground">
            Gerencie seus bens e propriedades.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Patrimônio
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>Novo Patrimônio</DialogTitle>
              <DialogDescription>
                Adicione um novo patrimônio ao seu portfólio.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Apartamento Centro"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Imóvel">Imóvel</SelectItem>
                          <SelectItem value="Veículo">Veículo</SelectItem>
                          <SelectItem value="Investimento">
                            Investimento
                          </SelectItem>
                          <SelectItem value="Outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="data_aquisicao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Aquisição</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="valor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor (R$)</FormLabel>
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
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isSubmitting ? "Salvando..." : "Salvar Patrimônio"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Valor Total dos Patrimônios
          </CardTitle>
          <Home className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {formatCurrency(totalValue.toString())}
          </div>
          <p className="text-xs text-muted-foreground">
            {patrimonios.length} itens registrados
          </p>
        </CardContent>
      </Card>

      {/* Patrimonios List/Table by Type */}
      {Object.keys(groupedPatrimonios).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedPatrimonios).map(([tipo, items]) => (
            <Card key={tipo}>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">
                  {tipo}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {items.length} {items.length === 1 ? "item" : "itens"}{" "}
                  registrados nesta categoria.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-[400px] w-full">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Data de Aquisição</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((patrimonio) => (
                        <TableRow key={patrimonio.id}>
                          <TableCell className="font-medium">
                            {patrimonio.nome}
                          </TableCell>
                          <TableCell>
                            {formatDate(patrimonio.data_aquisicao)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(patrimonio.valor.toString())}
                          </TableCell>
                          <TableCell className="text-right">
                            <Dialog
                              open={
                                isDeleteDialogOpen &&
                                patrimonioToDelete?.id === patrimonio.id
                              }
                              onOpenChange={(open) => {
                                setIsDeleteDialogOpen(open);
                                if (!open) setPatrimonioToDelete(null);
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  onClick={() =>
                                    setPatrimonioToDelete(patrimonio)
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Confirmar Exclusão</DialogTitle>
                                  <DialogDescription>
                                    Tem certeza que deseja excluir o patrimônio
                                    "{patrimonio.nome}"? Esta ação não pode ser
                                    desfeita.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button variant="outline">Cancelar</Button>
                                  </DialogClose>
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleDelete(patrimonio.id)}
                                    disabled={isSubmitting}
                                  >
                                    {isSubmitting && (
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    {isSubmitting ? "Excluindo..." : "Excluir"}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Home className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 font-medium text-foreground">
              Nenhum patrimônio cadastrado
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Clique em Adicionar Patrimônio para começar.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
