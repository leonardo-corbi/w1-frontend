"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  Target,
  Building2,
  FileText,
  GitPullRequest,
  Bell,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import type { CustomUser } from "@/types/CustomUser";
import type { Notificacao } from "@/types/Notificacao";
import { authAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  user: CustomUser | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  notificacoes: Notificacao[];
}

export function DashboardHeader({
  user,
  activeTab,
  setActiveTab,
  notificacoes,
}: DashboardHeaderProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadNotifications = notificacoes.filter((n) => !n.is_lida).length;

  const handleLogout = async () => {
    await authAPI.logout();
    router.push("/");
  };

  const navItems = [
    { id: "overview", label: "Visão Geral", icon: LayoutDashboard },
    { id: "patrimonios", label: "Patrimônios", icon: Home },
    { id: "objetivos", label: "Objetivos", icon: Target },
    { id: "holdings", label: "Holdings", icon: Building2 },
    { id: "documentos", label: "Documentos", icon: FileText },
    { id: "processos", label: "Processos", icon: GitPullRequest },
    {
      id: "notificacoes",
      label: "Notificações",
      icon: Bell,
      badge: unreadNotifications > 0 ? unreadNotifications : undefined,
    },
  ];

  return (
    <header className="bg-navy-900 text-white bg-slate-900 p-6 rounded-2xl">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={`relative ${
                  activeTab === item.id
                    ? "bg-navy-700 text-white"
                    : "text-navy-200 hover:bg-navy-800 hover:text-white"
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
                {item.badge && (
                  <Badge className="ml-2 bg-navy-500" variant="secondary">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            ))}
          </nav>

          <div className="flex items-center">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-navy-200 hover:bg-navy-800 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="ml-4 relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10 border-2 border-navy-700">
                    <AvatarFallback className="bg-navy-700 text-navy-200">
                      {user?.nome?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-navy-800 text-navy-100 border-navy-700 bg-slate-400"
              >
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-navy-700" />
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/me")}
                  className="hover:bg-navy-700 cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="hover:bg-navy-700 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-navy-800 py-2">
            <div className="space-y-1 px-2">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={`w-full justify-start ${
                    activeTab === item.id
                      ? "bg-navy-700 text-white"
                      : "text-navy-200 hover:bg-navy-700 hover:text-white"
                  }`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                >
                  <item.icon className="mr-2 h-5 w-5" />
                  {item.label}
                  {item.badge && (
                    <Badge className="ml-auto bg-navy-500" variant="secondary">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="container mx-auto py-4">
        <h1 className="text-2xl font-bold tracking-tight">
          {navItems.find((item) => item.id === activeTab)?.label || "Dashboard"}
        </h1>
        <p className="text-navy-300">
          {activeTab === "overview"
            ? `Bem-vindo, ${user?.nome}! Gerencie seus ativos e objetivos financeiros.`
            : `Gerencie seus ${
                navItems
                  .find((item) => item.id === activeTab)
                  ?.label.toLowerCase() || "itens"
              }.`}
        </p>
      </div>
    </header>
  );
}
