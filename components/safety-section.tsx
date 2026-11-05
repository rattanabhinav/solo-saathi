import { Shield, IdCard, Phone, Star, Clock } from "lucide-react"

const safetyFeatures = [
  {
    icon: IdCard,
    title: "ID Verification",
    description: "Every member verified via government ID. Real people, real identities."
  },
  {
    icon: Star,
    title: "Trail Ratings",
    description: "Post-trek reviews from past companions. See how they actually performed."
  },
  {
    icon: Phone,
    title: "Emergency Contacts",
    description: "Verified emergency contacts shared with your match. Peace of mind for everyone."
  },
  {
    icon: Shield,
    title: "Trust Infrastructure",
    description: "Community density in specific trek corridors. Data on what makes matches succeed."
  }
]

export function SafetySection() {
  return (
    <section id="safety" className="bg-night-camp relative overflow-hidden scroll-mt-[76px] pt-24 pb-36 lg:py-0 lg:min-h-[820px] flex flex-col justify-center px-6 text-white">
      {/* Ridge at the bottom */}
      <svg
        viewBox="0 0 1280 200"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 w-full h-[120px] lg:h-[200px]"
      >
        <path d="M0 200V120l180-70 140 50 200-90 170 80 160-40 200 70 230-60V200z" fill="#22306B" />
      </svg>

      <div className="relative w-full max-w-[1080px] mx-auto flex flex-col lg:flex-row lg:items-center gap-14 lg:gap-[72px]">
        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="eyebrow text-lime">Safety First</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-[5px] rounded-full bg-marigold text-forest text-xs font-bold">
              <Clock className="size-[13px]" />
              Launching Soon
            </span>
          </div>
          <h2 className="type-display text-[38px] sm:text-5xl lg:text-[52px] leading-[0.98] mt-4 text-balance">
            Trust infrastructure built for the trail
          </h2>
          <p className="mt-4 text-[17px] leading-[1.6] text-white/80">
            Our moat is trust. ID verification, trail ratings, emergency contacts, and community density
            in specific trek corridors. Plus data on what makes matches succeed.
          </p>

          <div className="flex flex-col gap-4 mt-[26px]">
            {safetyFeatures.map((feature) => (
              <div key={feature.title} className="flex gap-3.5">
                <div className="size-10 shrink-0 rounded-xl bg-lime/16 text-lime flex items-center justify-center">
                  <feature.icon className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold leading-tight">{feature.title}</h3>
                  <p className="mt-0.5 text-sm leading-normal text-white/70">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual */}
        <div className="relative w-full lg:w-[420px] h-[360px] lg:h-[440px] shrink-0 rounded-3xl bg-white/6 border border-white/16 flex flex-col items-center justify-center gap-3 text-center">
          <span className="absolute -top-3.5 right-5 inline-flex items-center px-3.5 py-[7px] rounded-full bg-marigold text-forest text-[13px] font-bold">
            Coming Soon
          </span>
          <div className="size-[140px] rounded-full bg-[radial-gradient(circle,rgba(184,242,107,0.35),rgba(184,242,107,0)_70%)] flex items-center justify-center">
            <div className="size-20 rounded-full border-2 border-lime bg-lime/14 text-lime flex items-center justify-center">
              <Shield className="size-[38px]" />
            </div>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-lime/16 text-lime text-xs font-semibold">
            Coming Soon
          </span>
          <p className="type-display text-[32px]">Verified Safety Layer</p>
        </div>
      </div>
    </section>
  )
}
