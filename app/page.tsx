"use client";

import { useAuth } from "@clerk/nextjs";
import { Header } from "@/components/home/header";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturesSection } from "@/components/home/features-section";
import { CtaSection } from "@/components/home/cta-section";
import { Footer } from "@/components/home/footer";

export default function Home() {
  const { isSignedIn } = useAuth();

  return (
    <div className="min-h-screen">
      <Header isSignedIn={!!isSignedIn} />
      <HeroSection isSignedIn={!!isSignedIn} />
      <FeaturesSection />
      <CtaSection isSignedIn={!!isSignedIn} />
      <Footer />
    </div>
  );
}
