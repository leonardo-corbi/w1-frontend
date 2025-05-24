import { Metadata } from "next";
import MainContent from "@/components/dashboard/main-content";
import { Navigation } from "@/components/dashboard/navigation";
import { Toaster } from "@/components/ui/sonner";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { cn } from "@/lib/utils";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Dashboard | W1 Consultorias",
  description: "Sua plataforma para controle financeiro.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AccessibilityProvider>
      <div className={cn("flex h-screen overflow-hidden bg-background")}>
        <Navigation />
        <MainContent>{children}</MainContent>
      </div>
      <Toaster richColors />
    </AccessibilityProvider>
  );
}
