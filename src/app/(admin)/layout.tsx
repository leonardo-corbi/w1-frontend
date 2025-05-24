import type { Metadata } from "next";
import { ReactNode } from "react";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Admin | W1 Consultorias",
  description: "Sua plataforma para controle financeiro.",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <main className="min-h-screen">{children}</main>;
}
