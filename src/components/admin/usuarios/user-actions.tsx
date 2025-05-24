"use client";

import { useState } from "react";
import { MoreHorizontal, Power, PowerOff } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { userAPI } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface UserActionsProps {
  userId: string;
  status: string;
}

export function UserActions({ userId, status }: UserActionsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"activate" | "deactivate">(
    "activate"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStatusChange = (type: "activate" | "deactivate") => {
    setActionType(type);
    setIsDialogOpen(true);
  };

  const confirmStatusChange = async () => {
    setIsSubmitting(true);
    try {
      await userAPI.toggleStatus(userId);
      toast.success(
        `Usuário ${
          actionType === "activate" ? "ativado" : "desativado"
        } com sucesso!`
      );
      setIsDialogOpen(false);
      window.dispatchEvent(new Event("userStatusChanged"));
    } catch (error) {
      console.error("Erro ao alterar status do usuário:", error);
      toast.error("Ocorreu um erro ao alterar o status do usuário.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 border-w1-gray-light"
          >
            <MoreHorizontal className="h-4 w-4 text-w1-gray" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {status === "active" ? (
            <DropdownMenuItem
              onClick={() => handleStatusChange("deactivate")}
              className="text-red-600 focus:text-red-600"
            >
              <PowerOff className="mr-2 h-4 w-4" />
              Desativar usuário
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => handleStatusChange("activate")}
              className="text-green-600 focus:text-green-600"
            >
              <Power className="mr-2 h-4 w-4" />
              Ativar usuário
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {actionType === "activate"
                ? "Ativar usuário"
                : "Desativar usuário"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "activate"
                ? "Tem certeza que deseja ativar este usuário? Ele terá acesso a todas as funcionalidades da plataforma."
                : "Tem certeza que deseja desativar este usuário? Ele perderá acesso a todas as funcionalidades da plataforma."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="border-w1-gray-light"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmStatusChange}
              className={
                actionType === "activate"
                  ? "bg-w1-green hover:bg-w1-green-dark text-black border"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {actionType === "activate" ? "Ativar" : "Desativar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
