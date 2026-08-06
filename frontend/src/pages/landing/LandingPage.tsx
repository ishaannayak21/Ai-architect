import { LandingFooter } from "@/components/layout/LandingFooter";
import { LandingNavbar } from "@/components/layout/LandingNavbar";
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
    <div className="min-h-screen bg-surface dark:bg-[#05060a]">
      <LandingNavbar />
      <main>
        <Hero />
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