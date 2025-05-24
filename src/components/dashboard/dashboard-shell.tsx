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
} from "lucide-react";
import { CustomUser } from "@/types/CustomUser";
import { Notificacao } from "@/types/Notificacao";
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface DashboardShellProps {
  children: React.ReactNode;
  user: CustomUser | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  notificacoes: Notificacao[];
}

export function DashboardShell({
  children,
  user,
  activeTab,
  setActiveTab,
  notificacoes,
}: DashboardShellProps) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <nav className="flex flex-col gap-4 pt-4">
                  {navItems.map((item) => (
                    <Button
                      key={item.id}
                      variant={activeTab === item.id ? "default" : "ghost"}
                      className="justify-start"
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <item.icon className="mr-2 h-5 w-5" />
                      {item.label}
                      {item.badge && (
                        <Badge className="ml-auto" variant="destructive">
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <Link href="/dashboard" className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-primary">MVC App</h1>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.nome?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/dashboard/me")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-background md:block">
          <nav className="flex flex-col gap-2 p-4">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon className="mr-2 h-5 w-5" />
                {item.label}
                {item.badge && (
                  <Badge className="ml-auto" variant="destructive">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            ))}
          </nav>
        </aside>
        <main className="flex-1 overflow-auto">
          <div className="container py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
