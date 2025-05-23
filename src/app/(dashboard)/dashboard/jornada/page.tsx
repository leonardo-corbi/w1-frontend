import { HeroSection } from "@/components/jornada/hero-section";
import { ProcessSection } from "@/components/jornada/process-section";
import { BenefitsSection } from "@/components/jornada/benefits-section";
import { FinanceVisualsSection } from "@/components/jornada/finance-visuals-section";
import { InteractiveChartSection } from "@/components/jornada/interactive-chart-section";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <HeroSection />
      <ProcessSection />
      <FinanceVisualsSection />
      <BenefitsSection />
      <InteractiveChartSection />
    </main>
  );
}
