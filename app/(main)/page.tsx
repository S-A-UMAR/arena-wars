import Link from "next/link";
import { Trophy, Users, Swords, BarChart3, Zap, Shield, DollarSign, ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { StatsSection } from "@/components/landing/stats-section";
import { LiveMatchesSection } from "@/components/landing/live-matches-section";
import { CTASection } from "@/components/landing/cta-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <LiveMatchesSection />
      <CTASection />
    </>
  );
}
