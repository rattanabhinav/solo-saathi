import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { VibeSummarySection } from "@/components/vibe-summary-section"
import { ProblemSection } from "@/components/problem-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { MatchingSection } from "@/components/matching-section"
import { SafetySection } from "@/components/safety-section"
import { StoriesSection } from "@/components/stories-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-forest text-forest">
      <Header />
      <HeroSection />
      <VibeSummarySection />
      <ProblemSection />
      <HowItWorksSection />
      <MatchingSection />
      <SafetySection />
      <StoriesSection />
      <CTASection />
      <Footer />
    </main>
  )
}
