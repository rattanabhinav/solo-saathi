import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ProblemSection } from "@/components/problem-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { MatchingSection } from "@/components/matching-section"
import { SafetySection } from "@/components/safety-section"
import { StoriesSection } from "@/components/stories-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
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
