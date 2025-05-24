"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserStatusBadge } from "./user-status-badge";
import { UserActions } from "./user-actions";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import Link from "next/link";

interface User {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  is_active: boolean;
  data_registro: string;
  tem_holding: boolean;
}

interface UserTableProps {
  users: User[];
}

export function UserTable({ users }: UserTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Paginação
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = users.slice(startIndex, startIndex + itemsPerPage);

  // Formatação de data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-w1-dark">
            <TableRow>
              <TableHead className="text-black font-medium">Nome</TableHead>
              <TableHead className="text-black font-medium">Email</TableHead>
              <TableHead className="text-black font-medium">CPF</TableHead>
              <TableHead className="text-black font-medium">Status</TableHead>
              <TableHead className="text-black font-medium">Cadastro</TableHead>
              <TableHead className="text-black font-medium">Holding</TableHead>
              <TableHead className="text-black font-medium text-right">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className="hover:bg-w1-gray-light transition-colors"
                >
                  <TableCell className="font-medium">{user.nome}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.cpf}</TableCell>
                  <TableCell>
                    <UserStatusBadge
                      status={user.is_active ? "active" : "inactive"}
                    />
                  </TableCell>
                  <TableCell>{formatDate(user.data_registro)}</TableCell>
                  <TableCell>{user.tem_holding ? "Sim" : "Não"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/usuarios/${user.id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 border-w1-gray-light"
                        >
                          <Eye className="h-4 w-4 text-w1-gray" />
                          <span className="sr-only">Ver detalhes</span>
                        </Button>
                      </Link>
                      <UserActions
                        userId={user.id}
                        status={user.is_active ? "active" : "inactive"}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-w1-gray"
                >
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {users.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-w1-gray-light">
          <div className="text-sm text-w1-gray">
            Mostrando{" "}
            <span className="font-medium">
              {Math.min(startIndex + 1, users.length)}
            </span>{" "}
            a{" "}
            <span className="font-medium">
              {Math.min(startIndex + itemsPerPage, users.length)}
            </span>{" "}
            de <span className="font-medium">{users.length}</span> resultados
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0 border-w1-gray-light"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Página anterior</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0 border-w1-gray-light"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Próxima página</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
