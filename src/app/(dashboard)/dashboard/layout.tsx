import { Metadata } from "next";
import MainContent from "@/components/dashboard/main-content";
import { Navigation } from "@/components/dashboard/navigation";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
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
      <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
        <aside className="relative">
          <Navigation />
        </aside>
        <MainContent>{children}</MainContent>
      </div>
    </AccessibilityProvider>
  );
}
