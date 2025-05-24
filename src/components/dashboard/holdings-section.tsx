"use client";

import { useState } from "react";
import type { Holding } from "@/types/Holding";
import { holdingAPI } from "@/lib/api";
import { getStatusLabel, getStatusVariant } from "@/lib/utils";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Building2, Plus, Pencil, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface HoldingsSectionProps {
  holdings: Holding[];
  fetchHoldings: () => Promise<void>;
}

// Updated Zod schema without status field
const holdingFormSchema = z.object({
  nome_holding: z.string().min(1, "Nome da holding é obrigatório"),
  cnpj: z
    .string()
    .min(14, "CNPJ deve ter 14 dígitos")
    .max(18, "CNPJ inválido")
    .regex(
      /^(\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}|\d{14})$/,
      "Formato de CNPJ inválido"
    ),
});

type HoldingFormValues = z.infer<typeof holdingFormSchema>;

export function HoldingsSection({
  holdings,
  fetchHoldings,
}: HoldingsSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingHolding, setEditingHolding] = useState<Holding | null>(null);

  const form = useForm<HoldingFormValues>({
    resolver: zodResolver(holdingFormSchema),
    defaultValues: {
      nome_holding: "",
      cnpj: "",
    },
  });

  const onSubmit = async (data: HoldingFormValues) => {
    setIsSubmitting(true);
    try {
      // Remove formatting from CNPJ and set status to pending
      const payload = {
        ...data,
        cnpj: data.cnpj.replace(/\D/g, ""),
        status: "pending" as "pending",
      };

      if (editingHolding) {
        await holdingAPI.update(editingHolding.id, payload);
        toast.success("Holding atualizada com sucesso!");
      } else {
        await holdingAPI.create(payload);
        toast.success("Holding adicionada com sucesso!");
      }

      await fetchHoldings();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar holding:", error);
      toast.error("Ocorreu um erro ao salvar a holding.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditHolding = (holding: Holding) => {
    setEditingHolding(holding);
    form.reset({
      nome_holding: holding.nome_holding,
      cnpj: holding.cnpj,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    form.reset({
      nome_holding: "",
      cnpj: "",
    });
    setEditingHolding(null);
  };

  const handleOpenDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Section Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            Holdings
          </h1>
          <p className="text-muted-foreground">
            Gerencie suas holdings empresariais.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Holding
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingHolding ? "Editar Holding" : "Nova Holding"}
              </DialogTitle>
              <DialogDescription>
                {editingHolding
                  ? "Edite os detalhes da sua holding."
                  : "Adicione uma nova holding ao seu portfólio."}
              </DialogDescription>
            </DialogHeader>
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
                        <Input
                          placeholder="Ex: W1 Participações Ltda"
                          {...field}
                        />
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

      {/* Holdings List - Refined Card Layout */}
      {holdings.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {holdings.map((holding) => (
            <Card key={holding.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {holding.nome_holding}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 flex-shrink-0"
                    onClick={() => handleEditHolding(holding)}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                </div>
                <CardDescription className="text-sm text-muted-foreground">
                  CNPJ: {holding.cnpj}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                {/* Add more relevant info if available */}
              </CardContent>
              <CardFooter className="pt-4 border-t">
                <Badge
                  variant={getStatusVariant(
                    holding.status === "pending"
                      ? "pending"
                      : holding.status === "approved"
                      ? "completed"
                      : holding.status === "rejected"
                      ? "processing"
                      : "pending"
                  )}
                >
                  {getStatusLabel(
                    holding.status === "pending"
                      ? "pending"
                      : holding.status === "approved"
                      ? "completed"
                      : holding.status === "rejected"
                      ? "processing"
                      : "pending"
                  )}
                </Badge>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 font-medium text-foreground">
              Nenhuma holding cadastrada
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Clique em Adicionar Holding para começar.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
