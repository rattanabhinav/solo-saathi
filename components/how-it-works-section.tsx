import { UserPlus, Compass, MessageCircle, MapPin } from "lucide-react"
import Image from "next/image"

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create Your Profile",
    description: "Tell us about your trek stamina, pace preference, accommodation style, budget range, and vibe. The more honest, the better your match.",
    accent: "#FF7A45",
    badgeColor: "text-[#FF6F61]",
    image: "/images/hero-bg.png",
    imagePosition: "object-[50%_38%]",
    imageAlt: "Snow-capped Himalayan peaks at sunrise above a sea of clouds"
  },
  {
    number: "02",
    icon: Compass,
    title: "Choose Your Trek",
    description: "Select the Himalayan corridor you’re planning — Kedarkantha, Hampta Pass, Valley of Flowers. We match within specific routes.",
    accent: "#E5486B",
    badgeColor: "text-[#0F7FB8]",
    image: "/images/trekkers-trail.png",
    imagePosition: "object-[50%_17%]",
    imageAlt: "Two trekkers laughing together on a mountain trail"
  },
  {
    number: "03",
    icon: MessageCircle,
    title: "Meet Your Match",
    description: "Get matched with 1-3 compatible trekkers. Chat, video call, and build trust before committing. No pressure, no obligation.",
    accent: "#6B4BC4",
    badgeColor: "text-dusk",
    image: "/images/trekkers-trail.png",
    imagePosition: "object-[50%_48%]",
    imageAlt: "Two trek companions chatting as they walk a meadow trail"
  },
  {
    number: "04",
    icon: MapPin,
    title: "Hit the Trail",
    description: "Arrive at the trailhead already feeling like friends. Share costs, share laughs, share the summit selfie.",
    accent: "#058561",
    badgeColor: "text-meadow",
    image: "/images/trekkers-summit.png",
    imagePosition: "object-[50%_28%]",
    imageAlt: "Three trekkers celebrating with raised arms below snowy peaks"
  }
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-trail-daylight relative overflow-hidden scroll-mt-[76px] pt-24 pb-20 px-6 lg:py-0 lg:min-h-[1640px] flex flex-col justify-center text-forest">
      <div className="prayer-flags" aria-hidden="true" />

      <div className="w-full max-w-[1080px] mx-auto flex flex-col items-center gap-4">
        {/* Section header */}
        <span className="eyebrow text-meadow">How It Works</span>
        <h2 className="type-display text-[38px] sm:text-5xl lg:text-[60px] leading-[0.98] text-center max-w-[900px] text-balance lg:text-wrap">
          From stranger to summit buddy in 4 steps
        </h2>

        {/* Steps */}
        <div className="relative w-full max-w-[1000px] mt-11 flex flex-col gap-14 lg:gap-10">
          {/* Trail line: ember → rhododendron → dusk → meadow */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 -ml-0.5 rounded-full bg-[linear-gradient(180deg,#FF7A45,#E5486B,#6B4BC4,#058561)]" />

          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative lg:grid lg:grid-cols-2 lg:gap-24 lg:items-center lg:h-[290px]"
            >
              {/* Knot on the trail line */}
              <div
                className="hidden lg:block absolute left-1/2 top-1/2 size-[22px] -ml-[11px] -mt-[11px] rounded-full border-4 border-white shadow-[0_2px_8px_rgba(6,38,29,0.25)] z-10"
                style={{ backgroundColor: step.accent }}
              />

              {/* Content */}
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <span className="type-display block text-[64px] leading-none" style={{ color: step.accent }}>
                  {step.number}
                </span>
                <h3 className="text-2xl font-extrabold leading-tight mt-1.5 mb-2">{step.title}</h3>
                <p className="text-base leading-[1.6] text-[#33504A]">{step.description}</p>
              </div>

              {/* Photo card */}
              <div
                className={`relative h-[260px] lg:h-[290px] mt-6 lg:mt-0 rounded-[20px] overflow-hidden bg-night shadow-[0_22px_40px_rgba(6,38,29,0.22)] flex items-end gap-2.5 p-4 transition-transform duration-300 hover:rotate-0 ${
                  index % 2 === 1 ? "lg:order-1 -rotate-2" : "rotate-2"
                }`}
              >
                <Image src={step.image} alt={step.imageAlt} fill className={`object-cover ${step.imagePosition}`} />
                <div className="absolute inset-0 bg-gradient-to-b from-forest/0 from-40% to-forest/70" />
                <div className="relative size-11 rounded-full bg-white flex items-center justify-center shadow-[0_6px_16px_rgba(0,0,0,0.2)]">
                  <step.icon className={`size-5 ${step.badgeColor}`} />
                </div>
                <span className="relative mb-[13px] text-sm font-bold text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.4)]">
                  {step.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
