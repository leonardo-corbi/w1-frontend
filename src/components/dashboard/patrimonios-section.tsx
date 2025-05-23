"use client";

import { useState } from "react";
import type { Patrimonio } from "@/types/Patrimonio";
import { patrimonioAPI } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
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
import { Home, Plus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PatrimoniosSectionProps {
  patrimonios: Patrimonio[];
  fetchPatrimonios: () => Promise<void>;
}

const patrimonioFormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  tipo: z.string().min(1, "Tipo é obrigatório"),
  data_aquisicao: z.string().min(1, "Data de aquisição é obrigatória"),
  valor: z.coerce.number().min(0, "Valor deve ser maior ou igual a zero"),
});

type PatrimonioFormValues = z.infer<typeof patrimonioFormSchema>;

export function PatrimoniosSection({
  patrimonios,
  fetchPatrimonios,
}: PatrimoniosSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

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
    setFormError(null);
    setFormSuccess(null);

    try {
      await patrimonioAPI.create(data);
      await fetchPatrimonios();
      setFormSuccess("Patrimônio adicionado com sucesso!");
      setTimeout(() => {
        setIsDialogOpen(false);
        form.reset();
        setFormSuccess(null);
      }, 1500);
    } catch (error) {
      console.error("Erro ao criar patrimônio:", error);
      setFormError("Ocorreu um erro ao adicionar o patrimônio.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Group patrimonios by type
  const groupedPatrimonios = patrimonios.reduce(
    (acc: { [key: string]: Patrimonio[] }, patrimonio) => {
      const tipo = patrimonio.tipo || "Sem Tipo";
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-navy-300">Gerencie seus bens e propriedades</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-navy-600 hover:bg-navy-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Patrimônio
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-navy-800 border-navy-700 text-white bg-slate-500">
            <DialogHeader>
              <DialogTitle>Novo Patrimônio</DialogTitle>
              <DialogDescription className="text-navy-300">
                Adicione um novo patrimônio ao seu portfólio.
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
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-navy-200">Nome</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nome do patrimônio"
                          {...field}
                          className="bg-navy-900 border-navy-700 text-white placeholder:text-navy-400"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-navy-200">Tipo</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-navy-900 border-navy-700 text-white">
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-navy-800 border-navy-700 text-black bg-slate-200">
                          <SelectItem
                            value="Imóvel"
                            className="focus:bg-navy-700"
                          >
                            Imóvel
                          </SelectItem>
                          <SelectItem
                            value="Veículo"
                            className="focus:bg-navy-700"
                          >
                            Veículo
                          </SelectItem>
                          <SelectItem
                            value="Investimento"
                            className="focus:bg-navy-700"
                          >
                            Investimento
                          </SelectItem>
                          <SelectItem
                            value="Outro"
                            className="focus:bg-navy-700"
                          >
                            Outro
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="data_aquisicao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-navy-200">
                        Data de Aquisição
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="bg-navy-900 border-navy-700 text-white"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="valor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-navy-200">
                        Valor (R$)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          {...field}
                          className="bg-navy-900 border-navy-700 text-white"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="bg-transparent border-navy-600 text-navy-300 hover:bg-navy-700 hover:text-white"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-navy-600 hover:bg-navy-700 text-white"
                  >
                    {isSubmitting ? "Salvando..." : "Salvar Patrimônio"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-navy-800 border-navy-700 bg-slate-400">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-navy-200">
              Total de Patrimônios
            </CardTitle>
            <Home className="h-4 w-4 text-navy-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(totalValue.toString())}
            </div>
            <p className="text-xs text-navy-300">
              {patrimonios.length} itens registrados
            </p>
          </CardContent>
        </Card>
      </div>

      {Object.keys(groupedPatrimonios).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedPatrimonios).map(([tipo, items]) => (
            <Card
              key={tipo}
              className="bg-navy-800 border-navy-700 bg-slate-400"
            >
              <CardHeader>
                <CardTitle className="text-white">{tipo}</CardTitle>
                <CardDescription className="text-navy-300">
                  {items.length} {items.length === 1 ? "item" : "itens"}{" "}
                  registrados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-navy-700">
                        <th className="px-4 py-2 text-left font-medium text-navy-300">
                          Nome
                        </th>
                        <th className="px-4 py-2 text-left font-medium text-navy-300">
                          Data de Aquisição
                        </th>
                        <th className="px-4 py-2 text-left font-medium text-navy-300">
                          Valor
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((patrimonio) => (
                        <tr
                          key={patrimonio.id}
                          className="border-b border-navy-700"
                        >
                          <td className="px-4 py-2 text-white">
                            {patrimonio.nome}
                          </td>
                          <td className="px-4 py-2 text-white">
                            {formatDate(patrimonio.data_aquisicao)}
                          </td>
                          <td className="px-4 py-2 text-white">
                            {formatCurrency(patrimonio.valor.toString())}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-navy-800 border-navy-700 bg-slate-400">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Home className="h-10 w-10 text-navy-500" />
            <p className="mt-4 text-center text-navy-300">
              Nenhum patrimônio cadastrado. Clique em "Adicionar Patrimônio"
              para começar.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
