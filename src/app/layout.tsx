import type { Metadata } from "next";
import { ReactNode } from "react";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Redirecionando... | W1 Consultorias",
  description: "Sua plataforma para controle financeiro.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="antialised" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
