import {
  Zap,
  Clock,
  Mountain,
  Home,
  Wallet,
  Utensils,
  Music,
  Smile,
  AlertTriangle,
  Phone
} from "lucide-react"

const matchingSignals = [
  { icon: Zap, tileColor: "bg-lime", label: "Trek Stamina", description: "Beginner to expert level" },
  { icon: Clock, tileColor: "bg-marigold", label: "Pace Preference", description: "Fast, moderate, or leisurely" },
  { icon: Mountain, tileColor: "bg-glacier", label: "Past Trek History", description: "Experience & altitude comfort" },
  { icon: Home, tileColor: "bg-salmon", label: "Accommodation Style", description: "Tent vs homestay vs lodge" },
  { icon: Wallet, tileColor: "bg-lilac", label: "Budget Range", description: "Backpacker to comfortable" },
  { icon: Utensils, tileColor: "bg-marigold", label: "Food Habits", description: "Veg, non-veg, dietary needs" },
  { icon: Music, tileColor: "bg-lilac", label: "Music & Vibe", description: "Playlists say a lot" },
  { icon: Smile, tileColor: "bg-lime", label: "Humor Style", description: "Because trail banter matters" },
  { icon: AlertTriangle, tileColor: "bg-salmon", label: "Risk Appetite", description: "Conservative to adventurous" },
  { icon: Phone, tileColor: "bg-glacier", label: "Emergency Behaviour", description: "How you handle tough situations" },
]

const extraSignals = ["Instagram Profile Analysis", "Travel Style Quiz", "Mutual Interests", "Schedule Compatibility"]

export function MatchingSection() {
  return (
    <section id="matching" className="bg-sunset-blaze relative overflow-hidden scroll-mt-[76px] pt-24 pb-28 lg:py-0 lg:min-h-[900px] flex flex-col justify-center px-6 text-white">
      {/* Faint ridge silhouette */}
      <svg
        viewBox="0 0 1280 260"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 w-full h-[160px] lg:h-[260px] opacity-14"
      >
        <path d="M0 260V150l160-90 120 70 180-120 150 110 140-60 180 100 170-110 180 90V260z" fill="#fff" />
      </svg>

      <div className="relative w-full max-w-[1080px] mx-auto flex flex-col items-center gap-[18px] text-center">
        {/* Section header */}
        <span className="eyebrow text-[#FFE3A3]">Deep Compatibility</span>
        <h2 className="type-display text-[38px] sm:text-5xl lg:text-[60px] leading-[0.98] text-balance">
          Not just logistics. Real compatibility
        </h2>
        <p className="text-[17px] lg:text-lg leading-[1.6] max-w-[640px] text-white/92 text-pretty">
          We match on 10+ signals that actually matter on the trail. Because your trek buddy should get you.
        </p>

        {/* Matching signals grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 w-full mt-7 text-left">
          {matchingSignals.map((signal) => (
            <div
              key={signal.label}
              className="flex flex-col gap-2 p-[18px] rounded-[18px] bg-white text-forest shadow-[0_12px_26px_rgba(60,10,30,0.28)] transition-transform duration-200 motion-safe:hover:-translate-y-1"
            >
              <div className={`size-10 mb-1 rounded-xl flex items-center justify-center ${signal.tileColor}`}>
                <signal.icon className="size-5" />
              </div>
              <h3 className="text-[15px] font-bold leading-tight">{signal.label}</h3>
              <p className="text-[13px] leading-[1.4] text-[#4A5F5B]">{signal.description}</p>
            </div>
          ))}
        </div>

        {/* Additional context */}
        <div className="flex flex-wrap justify-center gap-2.5 mt-5">
          {extraSignals.map((label) => (
            <span
              key={label}
              className="inline-flex items-center px-3.5 py-[7px] rounded-full bg-white/16 border border-white/45 text-[13px] font-semibold"
            >
              {label}
            </span>
          ))}
        </div>
        <p className="mt-2 max-w-[520px] text-[15px] leading-[1.6] text-white/92">
          The value isn’t logistics coordination. It’s psychological safety before the trip begins.
        </p>
      </div>
    </section>
  )
}
