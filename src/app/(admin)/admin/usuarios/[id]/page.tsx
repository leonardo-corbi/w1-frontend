"use client";

import { use, Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { userAPI } from "@/lib/api";
import { toast } from "sonner";
import { UserObjectives } from "@/components/admin/detalhes-usuario/user-objectives";
import { UserDocuments } from "@/components/admin/detalhes-usuario/user-documents";
import { UserHoldings } from "@/components/admin/detalhes-usuario/user-holdings";
import type { CustomUser } from "@/types/CustomUser";

interface UserDetailsPageProps {
  params: Promise<{ id: string }>;
}

function UserDetailsSkeleton() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

export default function UserDetailsPage({ params }: UserDetailsPageProps) {
  const router = useRouter();
  const { id } = use(params); // Extract id from URL
  const [user, setUser] = useState<CustomUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log("UserDetailsPage: Fetching user with id:", id);
        const response = await userAPI.getUser(id);
        console.log("UserDetailsPage: User data:", response.data);
        setUser(response.data);
      } catch (err: any) {
        console.error("UserDetailsPage: Erro ao buscar usuário:", err);
        setError("Não foi possível carregar os dados do usuário.");
        toast.error("Erro ao carregar usuário.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleToggleStatus = async () => {
    if (!user) return;
    try {
      const response = await userAPI.toggleStatus(id);
      setUser(response.data);
      toast.success(
        `Status do usuário alterado para ${
          response.data.is_active ? "Ativo" : "Inativo"
        }`
      );
    } catch (err: any) {
      console.error("UserDetailsPage: Erro ao alternar status:", err);
      toast.error("Erro ao alternar status do usuário.");
    }
  };

  if (isLoading) {
    return <UserDetailsSkeleton />;
  }

  if (error || !user) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error || "Usuário não encontrado."}</p>
            <Button
              onClick={() => router.push("/admin/usuarios")}
              className="mt-4"
            >
              Voltar para Lista de Usuários
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <Button
        variant="outline"
        onClick={() => router.push("/admin/usuarios")}
        className="mb-6"
      >
        Voltar
      </Button>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Detalhes do Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p>
                <strong>Nome:</strong> {user.nome} {user.sobrenome}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Telefone:</strong> {user.telefone || "Não informado"}
              </p>
            </div>
            <div>
              <p>
                <strong>Status:</strong> {user.is_active ? "Ativo" : "Inativo"}
              </p>
              <p>
                <strong>Data de Cadastro:</strong>{" "}
                {new Date(user.data_registro).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>
          <Button
            onClick={handleToggleStatus}
            variant={user.is_active ? "destructive" : "default"}
            className="mt-4"
          >
            {user.is_active ? "Desativar Usuário" : "Ativar Usuário"}
          </Button>
        </CardContent>
      </Card>

      <Suspense fallback={<UserDetailsSkeleton />}>
        <div className="space-y-6">
          <UserObjectives userId={id} />
          <UserHoldings userId={id} />
          <UserDocuments userId={id} />
        </div>
      </Suspense>
    </div>
  );
}
