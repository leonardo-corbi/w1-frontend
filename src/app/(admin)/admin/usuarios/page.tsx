"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { UserTable } from "@/components/admin/usuarios/user-table";
import { UserFilters } from "@/components/admin/usuarios/user-filter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { authAPI, userAPI } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  is_active: boolean;
  data_registro: string;
  tem_holding: boolean;
}

export default function UsuariosPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    dataInicio: "",
    dataFim: "",
  });
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStaff, setIsStaff] = useState<boolean | null>(null); // New state for is_staff

  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authAPI.getProfile();
        setIsStaff(response.data.is_staff); // Set is_staff state
        if (!response.data.is_staff) {
          router.push("/dashboard");
        }
      } catch (err) {
        console.error("Erro ao buscar perfil:", err);
        setIsStaff(false); // Assume not staff on error
        router.push("/dashboard");
      }
    };
    fetchProfile();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await userAPI.getAll({
        search: searchQuery,
        status: filters.status,
        data_inicio: filters.dataInicio,
        data_fim: filters.dataFim,
      });
      setUsers(
        response.data.map((user: any) => ({
          id: user.id,
          nome: user.nome,
          email: user.email,
          cpf: user.cpf,
          is_active: user.is_active ?? false,
          data_registro: user.data_registro ?? "",
          tem_holding: user.tem_holding ?? false,
        }))
      );
    } catch (err: any) {
      console.error("Erro ao buscar usuários:", err);
      if (err.response?.status === 403) {
        setError(
          "Acesso negado: apenas administradores podem visualizar a lista de usuários."
        );
      } else {
        setError("Ocorreu um erro ao carregar os usuários.");
      }
      toast.error(error || "Erro ao carregar usuários.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isStaff) {
      fetchUsers();
    }
  }, [searchQuery, filters, isStaff]);

  useEffect(() => {
    if (isStaff) {
      const handleStatusChange = () => {
        fetchUsers();
      };
      window.addEventListener("userStatusChanged", handleStatusChange);
      return () => {
        window.removeEventListener("userStatusChanged", handleStatusChange);
      };
    }
  }, [isStaff]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-w1-dark">Usuários</h1>
        <Link href="/dashboard">
          <Button className="bg-w1-green hover:bg-w1-green-dark text-black border">
            Voltar
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-w1-gray h-4 w-4" />
          <Input
            placeholder="Buscar por nome, email ou CPF..."
            className="pl-10 border-w1-gray-light focus:border-w1-green focus:ring-w1-green"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <UserFilters filters={filters} setFilters={setFilters} />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-w1-green" />
        </div>
      ) : error ? (
        <div className="text-center py-8 text-w1-red">{error}</div>
      ) : (
        <UserTable users={users} />
      )}
    </div>
  );
}
