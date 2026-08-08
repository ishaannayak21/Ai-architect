import { FeatureMarquee } from "@/components/layout/FeatureMarquee";
import { LandingFooter } from "@/components/layout/LandingFooter";
import { LandingNavbar } from "@/components/layout/LandingNavbar";
import { SelectedWorkSection } from "@/pages/landing/SelectedWorkSection";
import {
  CtaSection,
  Faq,
  Features,
  Hero,
  HowItWorks,
  Stats,
} from "@/pages/landing/sections";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-orange-500 selection:text-white">
      <LandingNavbar />
      <FeatureMarquee />
      <main>
        <Hero />
        <SelectedWorkSection />
        <Features />
        <Stats />
        <HowItWorks />
        <Faq />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}