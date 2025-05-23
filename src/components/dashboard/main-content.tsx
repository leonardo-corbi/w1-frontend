"use client";

import { useMobile } from "@/hooks/use-mobile";

export default function MainContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useMobile();
  return (
    <main className={`flex-1 overflow-y-auto ${isMobile ? "pt-16" : ""}`}>
      {children}
    </main>
  );
}
