import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="bg-dusk-sky relative overflow-hidden pt-24 pb-44 lg:py-0 lg:min-h-[560px] flex flex-col justify-center px-6 text-white">
      {/* Setting sun behind the ridges */}
      <div aria-hidden="true" className="sun-glow absolute left-1/2 -bottom-40 size-[420px] -translate-x-1/2" />
      <svg
        viewBox="0 0 1280 200"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 w-full h-[140px] lg:h-[200px]"
      >
        <path d="M0 200V110l150-60 120 50 170-90 140 80 120-40 160 70 150-80 130 50 140-40V200z" fill="#5B3A7A" />
        <path d="M0 200V160l220-40 200 30 240-50 220 40 200-30 200 30V200z" fill="#06261D" />
      </svg>

      <div className="relative w-full max-w-4xl mx-auto lg:-mt-[70px] flex flex-col items-center gap-6 text-center">
        <h2 className="type-display text-[48px] sm:text-7xl lg:text-[84px] leading-[0.92] text-balance">
          Ready to find your{" "}
          <span className="block italic text-lime">trail companion?</span>
        </h2>

        {/* Create profile */}
        <Button asChild variant="lime" size="xl" className="group">
          <Link href="/create-profile">
            Create Your Profile
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-[22px] text-sm text-white/92">
          <span className="flex items-center gap-2">
            <span className="size-[7px] rounded-full bg-lime" />
            No spam, ever
          </span>
          <span className="flex items-center gap-2">
            <span className="size-[7px] rounded-full bg-lime" />
            Free during launch
          </span>
        </div>
      </div>
    </section>
  )
}
