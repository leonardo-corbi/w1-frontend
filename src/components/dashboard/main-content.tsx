"use client";

import { useMobile } from "@/hooks/use-mobile"; // Assuming path is correct
import { cn } from "@/lib/utils"; // Assuming path is correct

export default function MainContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useMobile();

  return (
    <main
      className={cn(
        "flex-1 overflow-y-auto bg-background",
        // Add padding top only on mobile to account for the fixed header
        isMobile ? "pt-16" : ""
        // The main container padding is now handled within the page.tsx component
      )}
    >
      {children}
    </main>
  );
}

