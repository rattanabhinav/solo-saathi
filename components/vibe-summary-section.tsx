"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Heart } from "lucide-react"
import Link from "next/link"
import { CompatibilityCard, buildSignals } from "@/components/compatibility-card"
import { AiSparkleIcon, VibeSummary } from "@/components/vibe-summary"

// The preview on the right uses the real /matches card components with
// made-up data, so it always looks exactly like the actual match cards.
const previewMatches = [
  {
    name: "Ananya Rao",
    age: 27,
    city: "Delhi",
    trekDestination: "hampta-pass",
    overallScore: 84.2,
    signals: buildSignals({
      stamina_score: 100, pace_score: 90, breaks_score: 90, morning_score: 83, dietary_score: 100,
      music_score: 67, chat_score: 33, photos_score: 90, smoking_drinking_score: 83, risk_score: 90,
    }),
    summary:
      "You’re a close match on trail stamina and eat the same way on the trail, so pace and camp meals should be easy. Your social energy differs a little, so plan some quiet time between group stops.",
  },
  {
    name: "Rohan Mehta",
    age: 31,
    city: "Pune",
    trekDestination: "hampta-pass",
    overallScore: 79.5,
    signals: buildSignals({
      stamina_score: 90, pace_score: 100, breaks_score: 67, morning_score: 90, dietary_score: 83,
      music_score: 100, chat_score: 67, photos_score: 33, smoking_drinking_score: 90, risk_score: 83,
    }),
    summary: null,
  },
]

// Same Connect button as on /matches
const connectButtonClass =
  "h-10 sm:h-11 px-3 sm:px-5 has-[>svg]:px-3 sm:has-[>svg]:px-5 rounded-xl gap-1.5 sm:gap-2 text-sm sm:text-[15px] font-bold bg-meadow hover:bg-meadow/90"

export function VibeSummarySection() {
  return (
    <section className="bg-vibe-meadow relative overflow-hidden text-white px-6 pt-20 pb-32 lg:py-0 lg:min-h-[720px] flex flex-col justify-center">
      {/* Topographic contour lines */}
      <svg
        viewBox="0 0 600 600"
        aria-hidden="true"
        fill="none"
        stroke="#B8F26B"
        strokeWidth="1.5"
        className="absolute -left-[180px] -top-[120px] size-[560px] opacity-12"
      >
        <ellipse cx="300" cy="300" rx="290" ry="230" />
        <ellipse cx="300" cy="300" rx="220" ry="170" />
        <ellipse cx="300" cy="300" rx="150" ry="112" />
        <ellipse cx="300" cy="300" rx="80" ry="58" />
      </svg>

      {/* Ridges fading into the dark Problem section below */}
      <svg
        viewBox="0 0 1280 160"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 w-full h-[100px] lg:h-[160px]"
      >
        <path d="M0 160V90l170-60 130 40 180-70 160 70 140-40 190 60 150-50 160 40V160z" fill="#0B4A3A" />
        <path d="M0 160V130l220-30 200 22 240-40 220 30 200-24 200 26V160z" fill="#06261D" />
      </svg>

      <div className="relative w-full max-w-[1120px] mx-auto lg:-mt-[50px] flex flex-col lg:flex-row items-center gap-14 lg:gap-16">
        <div className="flex-1 flex flex-col items-start gap-[22px]">
          <span className="inline-flex items-center gap-2 px-3.5 py-[7px] rounded-full bg-white/12 border border-white/40 text-[13px] font-semibold">
            <AiSparkleIcon className="size-3.5 text-lime" />
            New
          </span>

          <h2 className="type-display text-[40px] sm:text-5xl lg:text-[60px] leading-[0.94]">
            Know why you’ll vibe{" "}
            <span className="block italic text-lime">Before you hit the trail</span>
          </h2>

          <p className="max-w-[480px] text-[17px] lg:text-lg leading-[1.6] text-white/90 text-pretty">
            Your matches now come with a short, honest summary of how you’d trek together, from pace and
            food to music and social energy. No more guessing.
          </p>

          <Button asChild variant="lime" size="xl" className="group">
            <Link href="/create-profile">
              Create Your Profile
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {/* Product preview: a picture of the matches screen, not live data */}
        <div
          role="img"
          aria-label="Example match card: Ananya Rao, an 84.2% match for Hampta Pass, with an AI Vibe Summary explaining why you may vibe"
          className="relative w-full max-w-[520px] shrink-0"
        >
          <div className="absolute -top-4 right-7 z-10 flex items-center gap-1.5 px-3.5 py-[7px] rounded-full bg-lime text-[#063B2C] text-[13px] font-bold shadow-[0_6px_16px_rgba(2,40,30,0.35)]">
            <AiSparkleIcon className="size-3.5" />
            AI Vibe Summary
          </div>

          {/* Same background as the /matches page. The first card is always
              shown in full; the next one peeks in below and fades out.
              inert: it's a picture, so its buttons can't be clicked or tabbed to */}
          <div
            inert
            className="relative overflow-hidden px-4 pt-4 rounded-3xl bg-[#EAF5FB] shadow-[0_30px_60px_rgba(2,40,30,0.5),0_0_0_6px_rgba(255,255,255,0.18)] flex flex-col gap-5"
          >
            {previewMatches.map((match, index) => {
              const card = (
                <CompatibilityCard
                  name={match.name}
                  age={match.age}
                  city={match.city}
                  trekDestination={match.trekDestination}
                  overallScore={match.overallScore}
                  signals={match.signals}
                  vibeSummary={match.summary ? <VibeSummary summary={match.summary} /> : undefined}
                  actions={
                    <Button size="sm" className={connectButtonClass}>
                      <Heart className="size-4 sm:size-5" />
                      Connect
                    </Button>
                  }
                />
              )
              return index === 0 ? (
                <div key={match.name}>{card}</div>
              ) : (
                <div key={match.name} className="relative h-[120px] -mx-4 px-4 overflow-hidden">
                  {card}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#EAF5FB]/0 from-20% to-[#EAF5FB]" />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
