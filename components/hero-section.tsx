"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Mountain, Users, Shield } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const stats = [
  { icon: Mountain, iconColor: "text-lime", value: "500K+", label: "Trekkers/Season" },
  { icon: Users, iconColor: "text-marigold", value: "2-4", label: "Perfect Group Size" },
  { icon: Shield, iconColor: "text-glacier", value: "100%", label: "ID Verified" },
]

export function HeroSection() {
  return (
    <section className="bg-hero-sky relative overflow-hidden text-white px-6 pt-28 pb-40 lg:pt-32 lg:pb-0 lg:min-h-[860px]">
      {/* Rising sun behind the ridges */}
      <div aria-hidden="true" className="sun-glow absolute left-1/2 -bottom-5 size-[320px] lg:size-[460px] -translate-x-1/2" />

      {/* Mountain ridges + dotted trail up to a summit flag */}
      <svg
        viewBox="0 0 1280 340"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 w-full h-[220px] lg:h-[340px]"
      >
        <path d="M0 340V170l120-60 90 40 160-110 120 80 110-50 150 90 140-120 130 70 120-40 140 80V340z" fill="#5B3A7A" />
        <path d="M0 340V230l150-70 110 50 170-90 160 100 130-40 160 70 140-60 260 90V340z" fill="#0F4C4A" />
        <path d="M0 340V285l200-40 180 30 220-60 200 50 180-30 300 40V340z" fill="#06261D" />
        <path d="M210 340C280 300 300 250 280 210S300 120 370 40" fill="none" stroke="#B8F26B" strokeWidth="3" strokeDasharray="2 10" strokeLinecap="round" />
        <line x1="370" y1="40" x2="370" y2="12" stroke="#fff" strokeWidth="2" />
        <path d="M370 12l20 7-20 7z" fill="#FFC15E" />
        <circle cx="282" cy="205" r="7" fill="#B8F26B" stroke="#06261D" strokeWidth="3" />
        <circle cx="312" cy="128" r="7" fill="#FFC15E" stroke="#06261D" strokeWidth="3" />
      </svg>

      <div className="relative max-w-[1120px] mx-auto flex flex-col lg:flex-row items-center gap-14">
        <div className="flex-1 flex flex-col items-start gap-[22px]">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-3.5 py-[7px] rounded-full bg-white/12 border border-white/35 text-[13px] font-semibold">
            <span className="size-[7px] rounded-full bg-lime motion-safe:animate-pulse" />
            For self-organised solo trekkers
          </span>

          {/* Main heading */}
          <h1 className="type-display text-[46px] sm:text-6xl lg:text-[74px] leading-[0.92]">
            Solo by identity{" "}
            <span className="block italic text-lime">Not entirely alone</span>
          </h1>

          {/* Subheading */}
          <p className="max-w-[560px] text-[17px] lg:text-[19px] leading-[1.6] text-white/92 text-pretty">
            Find your trek companion before you hit the trail. Matched by stamina, vibe, and safety behaviour
            — arrive at the trailhead already feeling like friends.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3.5 mt-1.5">
            <Button asChild variant="lime" size="xl" className="group">
              <Link href="/create-profile">
                Create Your Profile
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="glass" size="xl">
              <Link href="#how-it-works">See How It Works</Link>
            </Button>
          </div>

          {/* Stats — side-by-side chips as in the mockup; on phones they'd
              stack into a tall column, so they become a 3-across row with
              the icon above the number instead */}
          <div className="grid grid-cols-3 gap-2 w-full sm:flex sm:flex-wrap sm:gap-3 sm:w-auto mt-[22px]">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center text-center gap-1.5 px-2 py-3 sm:flex-row sm:text-left sm:gap-3.5 sm:px-[22px] sm:py-3.5 rounded-2xl bg-forest/62 border border-white/18 backdrop-blur-[10px]"
              >
                <stat.icon className={`size-6 sm:size-7 shrink-0 ${stat.iconColor}`} />
                <div>
                  <div className="type-display text-[28px] sm:text-4xl leading-none">{stat.value}</div>
                  <div className="mt-1 sm:mt-0 text-[11px] sm:text-[13px] leading-tight sm:leading-normal text-white/75 [overflow-wrap:anywhere]">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tilted group photo */}
        <div className="relative w-full max-w-[300px] lg:max-w-[380px] shrink-0 rotate-[2.5deg]">
          <div className="relative h-[360px] lg:h-[440px] rounded-3xl overflow-hidden border-[6px] border-white shadow-[0_30px_60px_rgba(11,26,60,0.5)]">
            <Image
              src="/images/trekkers-summit.png"
              alt="Three trekkers celebrating together below snowy Himalayan peaks"
              fill
              className="object-cover object-[50%_40%]"
              priority
            />
          </div>
          <span className="absolute -left-4 lg:-left-[30px] bottom-10 -rotate-[2.5deg] inline-flex items-center gap-2 px-3.5 py-[7px] rounded-full bg-lime text-forest text-[13px] font-bold shadow-[0_10px_24px_rgba(6,38,29,0.35)]">
            <Users className="size-4" />
            Strangers to summit buddies
          </span>
        </div>
      </div>
    </section>
  )
}
