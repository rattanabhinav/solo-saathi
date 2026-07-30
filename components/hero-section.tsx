"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Mountain, Users, Shield } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.png"
          alt="Himalayan mountain peaks at sunrise"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/50 to-white/90" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-primary/20 mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm text-foreground/80 font-medium">For self-organised solo trekkers</span>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 text-balance leading-tight">
          Solo by identity.
          <br />
          <span className="text-primary">Not entirely alone.</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto mb-10 leading-relaxed text-pretty">
          Find your trek companion before you hit the trail. Matched by stamina, vibe, and safety behaviour 
          — arrive at the trailhead already feeling like friends.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/auth">
            <Button size="lg" className="text-base bg-primary text-primary-foreground hover:bg-primary/90 group shadow-lg shadow-primary/25">
              Create Your Profile
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="text-base border-foreground/20 bg-white/60 backdrop-blur-sm hover:bg-white/80">
            See How It Works
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-xl mx-auto">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border border-primary/20 mb-3 shadow-sm">
              <Mountain className="w-5 h-5 text-primary" />
            </div>
            <span className="text-2xl md:text-3xl font-bold text-foreground">500K+</span>
            <span className="text-sm text-foreground/60">Trekkers/Season</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border border-primary/20 mb-3 shadow-sm">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <span className="text-2xl md:text-3xl font-bold text-foreground">2-4</span>
            <span className="text-sm text-foreground/60">Perfect Group Size</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border border-primary/20 mb-3 shadow-sm">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <span className="text-2xl md:text-3xl font-bold text-foreground">100%</span>
            <span className="text-sm text-foreground/60">ID Verified</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs text-foreground/60 font-medium">Scroll to explore</span>
        <div className="w-6 h-10 rounded-full border-2 border-foreground/20 flex items-start justify-center p-2 bg-white/50 backdrop-blur-sm">
          <div className="w-1 h-2 rounded-full bg-primary animate-bounce" />
        </div>
      </div>
    </section>
  )
}
