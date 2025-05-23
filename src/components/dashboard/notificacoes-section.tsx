"use client";

import { useState } from "react";
import type { Notificacao } from "@/types/Notificacao";
import { notificacaoAPI } from "@/lib/api";
import { formatDate, getTipoNotificacaoLabel } from "@/lib/utils";
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
import {
  Bell,
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
  Info,
  MessageSquare,
} from "lucide-react";
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

interface NotificacoesSectionProps {
  notificacoes: Notificacao[];
  fetchNotificacoes: () => Promise<void>;
}

const notificacaoFormSchema = z.object({
  mensagem: z.string().min(1, "Mensagem é obrigatória"),
  tipo: z.string().min(1, "Tipo é obrigatório"),
  data_envio: z.string().min(1, "Data de envio é obrigatória"),
  is_lida: z.boolean(),
});

type NotificacaoFormValues = z.infer<typeof notificacaoFormSchema>;

export function NotificacoesSection({
  notificacoes,
  fetchNotificacoes,
}: NotificacoesSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingNotificacao, setEditingNotificacao] =
    useState<Notificacao | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  const form = useForm<NotificacaoFormValues>({
    resolver: zodResolver(notificacaoFormSchema),
    defaultValues: {
      mensagem: "",
      tipo: "alert",
      data_envio: new Date().toISOString().split("T")[0],
      is_lida: false,
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      if (editingNotificacao) {
        await notificacaoAPI.update(editingNotificacao.id, data);
        setFormSuccess("Notificação atualizada com sucesso!");
      } else {
        await notificacaoAPI.create(data);
        setFormSuccess("Notificação adicionada com sucesso!");
      }

      await fetchNotificacoes();

      setTimeout(() => {
        setIsDialogOpen(false);
        resetForm();
        setFormSuccess(null);
      }, 1500);
    } catch (error) {
      console.error("Erro ao salvar notificação:", error);
      setFormError("Ocorreu um erro ao salvar a notificação.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditNotificacao = (notificacao: Notificacao) => {
    setEditingNotificacao(notificacao);
    form.reset({
      mensagem: notificacao.mensagem,
      tipo: notificacao.tipo,
      data_envio: notificacao.data_envio,
      is_lida: notificacao.is_lida,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteNotificacao = async (id: string) => {
    try {
      await notificacaoAPI.delete(id);
      await fetchNotificacoes();
      setDeleteSuccess("Notificação excluída com sucesso!");

      setTimeout(() => {
        setDeleteSuccess(null);
      }, 3000);
    } catch (error) {
      console.error("Erro ao excluir notificação:", error);
      setFormError("Ocorreu um erro ao excluir a notificação.");

      setTimeout(() => {
        setFormError(null);
      }, 3000);
    }
  };

  const resetForm = () => {
    form.reset({
      mensagem: "",
      tipo: "alert",
      data_envio: new Date().toISOString().split("T")[0],
      is_lida: false,
    });
    setEditingNotificacao(null);
  };

  const handleOpenDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const getNotificationIcon = (tipo: string) => {
    switch (tipo) {
      case "alert":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case "update":
        return <Info className="h-5 w-5 text-primary" />;
      case "request":
        return <MessageSquare className="h-5 w-5 text-amber-500" />;
      default:
        return <Bell className="h-5 w-5" />;
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
          <h2 className="text-2xl font-bold tracking-tight">Notificações</h2>
          <p className="text-muted-foreground">
            Gerencie suas notificações e alertas
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Notificação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingNotificacao ? "Editar Notificação" : "Nova Notificação"}
              </DialogTitle>
              <DialogDescription>
                {editingNotificacao
                  ? "Edite os detalhes da sua notificação."
                  : "Adicione uma nova notificação ao sistema."}
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
                  name="mensagem"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mensagem</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Digite a mensagem da notificação"
                          rows={4}
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
                          <SelectItem value="alert">Alerta</SelectItem>
                          <SelectItem value="update">Atualização</SelectItem>
                          <SelectItem value="request">Solicitação</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="data_envio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Envio</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="is_lida"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(value === "true")
                          }
                          defaultValue={field.value ? "true" : "false"}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="true">Lida</SelectItem>
                            <SelectItem value="false">Não lida</SelectItem>
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
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? "Salvando..."
                      : editingNotificacao
                      ? "Atualizar Notificação"
                      : "Salvar Notificação"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {notificacoes.length > 0 ? (
        <div className="space-y-4">
          {notificacoes.map((notificacao) => (
            <Card
              key={notificacao.id}
              className={notificacao.is_lida ? "opacity-70" : ""}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getNotificationIcon(notificacao.tipo)}
                    <CardTitle className="text-lg">
                      {getTipoNotificacaoLabel(notificacao.tipo)}
                    </CardTitle>
                    {!notificacao.is_lida && (
                      <Badge variant="destructive" className="ml-2">
                        Nova
                      </Badge>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditNotificacao(notificacao)}
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
                            Tem certeza que deseja excluir esta notificação?
                            Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleDeleteNotificacao(notificacao.id)
                            }
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <CardDescription>
                  {formatDate(notificacao.data_envio)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{notificacao.mensagem}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Bell className="h-10 w-10 text-muted-foreground" />
            <p className="mt-4 text-center text-muted-foreground">
              Nenhuma notificação cadastrada. Clique em "Adicionar Notificação"
              para começar.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
