import { Heart, Activity, Shield, Users } from "lucide-react"

const problems = [
  {
    icon: Heart,
    tileColor: "bg-coral",
    title: "Autonomy Without Isolation",
    description: "You want to go solo — no compromise on pace or itinerary. But you shouldn’t go entirely alone."
  },
  {
    icon: Activity,
    tileColor: "bg-lime",
    title: "Safety & Support",
    description: "Someone to pull you out if altitude sickness hits. Emotional support on hard days. Real backup."
  },
  {
    icon: Users,
    tileColor: "bg-marigold",
    title: "Cost Sharing",
    description: "Split the jeep, share the homestay. Solo identity, shared expenses."
  },
  {
    icon: Shield,
    tileColor: "bg-glacier",
    title: "Not Random Strangers",
    description: "Existing solutions are unstructured forums with zero compatibility signal. We fix that."
  }
]

export function ProblemSection() {
  return (
    <section className="relative overflow-hidden py-20 px-6 lg:min-h-[840px] flex flex-col justify-center bg-forest text-white">
      {/* Topographic contour lines */}
      <svg
        viewBox="0 0 600 600"
        aria-hidden="true"
        fill="none"
        stroke="#B8F26B"
        strokeWidth="1.5"
        className="absolute -right-[140px] -top-20 size-[660px] opacity-14"
      >
        <ellipse cx="300" cy="300" rx="290" ry="230" />
        <ellipse cx="310" cy="290" rx="235" ry="185" />
        <ellipse cx="320" cy="285" rx="180" ry="140" />
        <ellipse cx="330" cy="280" rx="125" ry="95" />
        <ellipse cx="338" cy="276" rx="70" ry="52" />
      </svg>
      <svg
        viewBox="0 0 600 600"
        aria-hidden="true"
        fill="none"
        stroke="#FFC15E"
        strokeWidth="1.5"
        className="absolute -left-[200px] -bottom-[240px] size-[520px] opacity-12"
      >
        <ellipse cx="300" cy="300" rx="290" ry="230" />
        <ellipse cx="300" cy="300" rx="220" ry="170" />
        <ellipse cx="300" cy="300" rx="150" ry="112" />
        <ellipse cx="300" cy="300" rx="80" ry="58" />
      </svg>

      <div className="relative w-full max-w-[1080px] mx-auto flex flex-col items-center gap-[18px] text-center">
        {/* Section header */}
        <span className="eyebrow text-lime">The Problem</span>
        <h2 className="type-display text-[38px] sm:text-5xl lg:text-[60px] leading-[0.98] max-w-[820px] text-balance lg:text-wrap">
          Solo trekkers want autonomy but not isolation
        </h2>
        <p className="text-[17px] lg:text-lg leading-[1.6] max-w-[640px] text-white/80 text-pretty">
          “Solo by identity, not entirely alone by necessity.” The existing solutions don’t get this.
        </p>

        {/* Problem cards */}
        <div className="grid md:grid-cols-2 gap-5 w-full max-w-[1000px] mt-7 text-left">
          {problems.map((problem) => (
            <div
              key={problem.title}
              className="flex gap-[18px] p-[26px] rounded-[20px] bg-white/6 border border-white/14 transition-colors hover:bg-white/10 hover:border-white/25"
            >
              <div className={`size-11 shrink-0 rounded-xl flex items-center justify-center text-forest ${problem.tileColor}`}>
                <problem.icon className="size-5" />
              </div>
              <div>
                <h3 className="text-[19px] font-bold leading-tight mb-1.5">{problem.title}</h3>
                <p className="text-[15px] leading-[1.55] text-white/75">{problem.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quote */}
        <blockquote className="type-display italic text-[30px] sm:text-4xl lg:text-[46px] leading-none text-lime mt-10">
          “Friends on rent, not co-travellers”
        </blockquote>
        <p className="text-[15px] text-white/70">The value is psychological safety before the trip begins</p>
      </div>
    </section>
  )
}
