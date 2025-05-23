import type { Metadata } from "next";
import { ReactNode } from "react";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Autenticação... | W1 Consultorias",
  description: "Sua plataforma para controle financeiro.",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <main className="min-h-screen">{children}</main>;
}
