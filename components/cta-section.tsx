"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function CTASection() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubmitted(true)
      setEmail("")
    }
  }

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/trekkers-summit.png"
          alt="Trekkers celebrating at summit"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-white/80" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Main CTA */}
        <div className="relative">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Ready to find your<br />
            <span className="text-primary">trail companion?</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 text-pretty">
            Join the waitlist. Be the first to know when we launch in your trek corridor.
          </p>

          {/* Email form */}
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-12 bg-white border-border focus:border-primary shadow-sm"
                required
              />
              <Button type="submit" size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 group shadow-lg shadow-primary/20">
                Join Waitlist
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-2 text-primary mb-6">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">{"You're on the list! We'll be in touch soon."}</span>
            </div>
          )}

          {/* Or create profile */}
          <div className="mb-8">
            <p className="text-sm text-muted-foreground mb-3">Or start building your profile now</p>
            <Link href="/create-profile">
              <Button variant="outline" size="lg" className="bg-white/80 backdrop-blur-sm border-foreground/20 hover:bg-white">
                Create Your Profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              No spam, ever
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Free during launch
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Launching soon
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
