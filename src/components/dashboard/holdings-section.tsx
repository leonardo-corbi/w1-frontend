"use client";

import { useState } from "react";
import type { Holding } from "@/types/Holding";
import { holdingAPI } from "@/lib/api";
import { getStatusLabel } from "@/lib/utils";
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
import { Building2, Plus, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface HoldingsSectionProps {
  holdings: Holding[];
  fetchHoldings: () => Promise<void>;
}

const holdingFormSchema = z.object({
  nome_holding: z.string().min(1, "Nome da holding é obrigatório"),
  cnpj: z.string().min(14, "CNPJ deve ter pelo menos 14 caracteres"),
  status: z.string().min(1, "Status é obrigatório"),
});

type HoldingFormValues = z.infer<typeof holdingFormSchema>;

export function HoldingsSection({
  holdings,
  fetchHoldings,
}: HoldingsSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingHolding, setEditingHolding] = useState<Holding | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const form = useForm<HoldingFormValues>({
    resolver: zodResolver(holdingFormSchema),
    defaultValues: {
      nome_holding: "",
      cnpj: "",
      status: "pending",
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      if (editingHolding) {
        await holdingAPI.update(editingHolding.id, data);
        setFormSuccess("Holding atualizada com sucesso!");
      } else {
        await holdingAPI.create(data);
        setFormSuccess("Holding adicionada com sucesso!");
      }

      await fetchHoldings();

      setTimeout(() => {
        setIsDialogOpen(false);
        resetForm();
        setFormSuccess(null);
      }, 1500);
    } catch (error) {
      console.error("Erro ao salvar holding:", error);
      setFormError("Ocorreu um erro ao salvar a holding.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditHolding = (holding: Holding) => {
    setEditingHolding(holding);
    form.reset({
      nome_holding: holding.nome_holding,
      cnpj: holding.cnpj,
      status: holding.status,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    form.reset({
      nome_holding: "",
      cnpj: "",
      status: "pending",
    });
    setEditingHolding(null);
  };

  const handleOpenDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Holdings</h2>
          <p className="text-navy-300">Gerencie suas holdings empresariais</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleOpenDialog}
              className="bg-navy-600 hover:bg-navy-700 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Holding
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-navy-800 border-navy-700 text-white bg-slate-500">
            <DialogHeader>
              <DialogTitle>
                {editingHolding ? "Editar Holding" : "Nova Holding"}
              </DialogTitle>
              <DialogDescription className="text-navy-300">
                {editingHolding
                  ? "Edite os detalhes da sua holding."
                  : "Adicione uma nova holding ao seu portfólio."}
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
                  name="nome_holding"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Holding</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da holding" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cnpj"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CNPJ</FormLabel>
                      <FormControl>
                        <Input placeholder="00.000.000/0000-00" {...field} />
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
                          <SelectItem value="approved">Aprovado</SelectItem>
                          <SelectItem value="rejected">Rejeitado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                      : editingHolding
                      ? "Atualizar Holding"
                      : "Salvar Holding"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {holdings.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {holdings.map((holding) => (
            <Card key={holding.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {holding.nome_holding}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditHolding(holding)}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                </div>
                <CardDescription>CNPJ: {holding.cnpj}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className="mt-1">
                      {getStatusLabel(holding.status)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Building2 className="h-10 w-10 text-muted-foreground" />
            <p className="mt-4 text-center text-muted-foreground">
              Nenhuma holding cadastrada. Clique em "Adicionar Holding" para
              começar.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
