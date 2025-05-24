"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation"; // Added useRouter
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  BarChart3,
  Activity,
  ChevronLeft,
  ChevronRight,
  X,
  Menu,
  Settings,
  LogOut,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { AccessibilityControls } from "@/components/ui/accessibility-controls";
import { authAPI } from "@/lib/api";
import type { CustomUser } from "@/types/CustomUser";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
  isCollapsed?: boolean;
}

function NavItem({
  icon,
  label,
  href,
  active,
  onClick,
  isCollapsed,
}: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-x-2 text-sm font-medium px-3 py-2.5 rounded-lg transition-all duration-200 text-nowrap",
        active
          ? "bg-[#1A2A3A] text-white"
          : "text-gray-300 hover:bg-[#1A2A3A] hover:text-white",
        isCollapsed && "justify-center px-2"
      )}
      onClick={onClick}
    >
      {icon}
      {!isCollapsed && <span>{label}</span>}
    </Link>
  );
}

export function Navigation() {
  const isMobile = useMobile();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter(); // Added for navigation
  const [user, setUser] = useState<CustomUser | null>(null);

  // Fetch user profile to check is_staff
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await authAPI.getProfile();
        setUser(response.data);
      } catch (err) {
        console.error("Erro ao carregar perfil do usuário:", err);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await authAPI.logout(); // Ensure logout API call is made
      setUser(null); // Clear user state
      router.push("/login"); // Redirect to login page
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
      alert("Falha ao fazer logout. Tente novamente.");
    }
  };

  // Define navItems, conditionally including Admin tab
  const navItems = [
    {
      icon: <Activity className="h-5 w-5" />,
      label: "Minha jornada",
      href: "/dashboard/jornada",
    },
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      label: "Simulador",
      href: "/dashboard/simulador",
    },
    ...(user?.is_staff
      ? [
          {
            icon: <Users className="h-5 w-5" />,
            label: "Admin",
            href: "/admin/usuarios",
          },
        ]
      : []),
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "h-full flex-col border-r border-gray-800 bg-[#001122] transition-all duration-300",
          isCollapsed ? "w-20" : "w-64",
          "hidden md:flex"
        )}
      >
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-x-3">
            {!isCollapsed ? (
              <div className="flex items-center">
                <Image
                  src="/logos/w1-white.png"
                  alt="W1 Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                  priority
                />
              </div>
            ) : (
              <div className="text-xl font-bold text-white flex items-center mx-auto">
                <Image
                  src="/logos/w1-white.png"
                  alt="W1 Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                  priority
                />
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-300 hover:text-white hover:bg-[#1A2A3A]"
            onClick={toggleSidebar}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          <div className="space-y-4">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                active={
                  pathname === item.href ||
                  (item.href !== "/dashboard/jornada" &&
                    pathname.startsWith(item.href))
                }
                isCollapsed={isCollapsed}
              />
            ))}
          </div>
        </ScrollArea>

        <div className="border-t border-gray-800 p-3">
          <div
            className={cn(
              "flex items-center",
              isCollapsed ? "justify-center" : "justify-between"
            )}
          >
            {!isCollapsed ? (
              <>
                <div className="text-xl font-bold text-white flex items-center">
                  <Image
                    src="/logos/w1-tagline-white.png"
                    alt="W1 Logo"
                    width={120}
                    height={40}
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="flex gap-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-300 hover:text-white hover:bg-[#1A2A3A]"
                        aria-label="Abrir configurações de acessibilidade"
                      >
                        <Settings className="h-5 w-5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Modo de Acessibilidade</DialogTitle>
                      </DialogHeader>
                      <AccessibilityControls />
                      <DialogClose asChild>
                        <Button variant="outline" className="mt-4 w-full">
                          Fechar
                        </Button>
                      </DialogClose>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-300 hover:text-white hover:bg-[#1A2A3A]"
                    onClick={handleLogout} // Updated to use handleLogout
                    aria-label="Fazer logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-300 hover:text-white hover:bg-[#1A2A3A]"
                      aria-label="Abrir configurações de acessibilidade"
                    >
                      <Settings className="h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Modo de Acessibilidade</DialogTitle>
                    </DialogHeader>
                    <AccessibilityControls />
                    <DialogClose asChild>
                      <Button variant="outline" className="mt-4 w-full">
                        Fechar
                      </Button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-300 hover:text-white hover:bg-[#1A2A3A]"
                  onClick={handleLogout} // Added logout button for collapsed state
                  aria-label="Fazer logout"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-[#001122] border-b border-gray-800 px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-300 hover:text-white hover:bg-[#1A2A3A]"
              onClick={() => setMobileNavOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="ml-3">
              <Image
                src="/logos/w1-white.png"
                alt="W1 Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-300 hover:text-white hover:bg-[#1A2A3A]"
                  aria-label="Abrir configurações de acessibilidade"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Modo de Acessibilidade</DialogTitle>
                </DialogHeader>
                <AccessibilityControls />
                <DialogClose asChild>
                  <Button variant="outline" className="mt-4 w-full">
                    Fechar
                  </Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-300 hover:text-white hover:bg-[#1A2A3A]"
              onClick={handleLogout} // Updated to use handleLogout
              aria-label="Fazer logout"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {isMobile && (
        <div
          className={cn(
            "fixed inset-0 z-50 flex md:hidden transition-opacity duration-300 ease-in-out",
            !mobileNavOpen && "opacity-0 pointer-events-none"
          )}
        >
          <div
            className="fixed inset-0 bg-black/50 transition-opacity duration-300 ease-in-out"
            onClick={() => setMobileNavOpen(false)}
          />
          <div
            className={cn(
              "relative flex w-4/5 max-w-xs flex-1 flex-col bg-[#001122] transition-transform duration-300 ease-in-out",
              mobileNavOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <div className="flex items-center justify-between border-b border-gray-800 p-4">
              <div className="flex items-center">
                <Image
                  src="/logos/w1-white.png"
                  alt="W1 Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-300 hover:text-white hover:bg-[#1A2A3A]"
                onClick={() => setMobileNavOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <ScrollArea className="flex-1 px-3 py-4">
              <div className="space-y-1">
                {navItems.map((item) => (
                  <NavItem
                    key={item.href}
                    icon={item.icon}
                    label={item.label}
                    href={item.href}
                    active={
                      pathname === item.href ||
                      (item.href !== "/dashboard/jornada" &&
                        pathname.startsWith(item.href))
                    }
                    onClick={() => setMobileNavOpen(false)}
                  />
                ))}
              </div>
            </ScrollArea>
            <div className="border-t border-gray-800 p-4">
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold text-white flex items-center">
                  <Image
                    src="/logos/w1-tagline-white.png"
                    alt="W1 Logo"
                    width={120}
                    height={40}
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="flex gap-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-300 hover:text-white hover:bg-[#1A2A3A]"
                        aria-label="Abrir configurações de acessibilidade"
                      >
                        <Settings className="h-5 w-5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Modo de Acessibilidade</DialogTitle>
                      </DialogHeader>
                      <AccessibilityControls />
                      <DialogClose asChild>
                        <Button variant="outline" className="mt-4 w-full">
                          Fechar
                        </Button>
                      </DialogClose>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-300 hover:text-white hover:bg-[#1A2A3A]"
                    onClick={handleLogout} // Updated to use handleLogout
                    aria-label="Fazer logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}