const stories = [
  {
    quote: "Met Priya through SoloSaathi for Kedarkantha. We had the exact same pace and both loved early morning starts. By day 2, it felt like we’d known each other for years.",
    name: "Arjun Mahajan",
    trek: "Kedarkantha, Oct 2026",
    initials: "AM",
    matchScore: "94%",
    tilt: "-rotate-[1.5deg]",
    quoteColor: "text-ember",
    avatarColor: "bg-lime"
  },
  {
    quote: "I was nervous about doing Hampta Pass solo. My match Rohan had done it twice before. His experience plus our matching vibe made it the best trek of my life.",
    name: "Sneha Kataria",
    trek: "Hampta Pass, Oct 2026",
    initials: "SK",
    matchScore: "91%",
    tilt: "rotate-1",
    quoteColor: "text-rhodo",
    avatarColor: "bg-marigold"
  },
  {
    quote: "The compatibility matching is real. Same budget, same food preferences, same love for sunset photography. We’re planning our third trek together now.",
    name: "Vikram Singh",
    trek: "Valley of Flowers, Oct 2026",
    initials: "VS",
    matchScore: "97%",
    tilt: "-rotate-1",
    quoteColor: "text-dusk",
    avatarColor: "bg-lilac"
  }
]

export function StoriesSection() {
  return (
    <section id="stories" className="bg-campfire relative overflow-hidden scroll-mt-[76px] pt-24 pb-20 lg:py-0 lg:min-h-[900px] flex flex-col justify-center px-6 text-forest">
      <div className="prayer-flags" aria-hidden="true" />

      <div className="w-full max-w-[1080px] mx-auto flex flex-col items-center gap-[18px] text-center">
        {/* Section header */}
        <span className="eyebrow text-[#C2410C]">Trail Stories</span>
        <h2 className="type-display text-[38px] sm:text-5xl lg:text-[60px] leading-[0.98] text-balance">
          Strangers to summit buddies
        </h2>
        <p className="text-[17px] lg:text-lg leading-[1.6] max-w-[640px] text-[#5A3E2E] text-pretty">
          Real matches, real treks, real friendships. One viral story at a time.
        </p>

        {/* Stories grid */}
        <div className="grid md:grid-cols-3 gap-6 w-full mt-[30px] text-left">
          {stories.map((story) => (
            <div
              key={story.name}
              className={`flex flex-col gap-4 p-[26px] rounded-[22px] bg-white shadow-[0_18px_36px_rgba(122,46,29,0.16)] transition-transform duration-300 hover:rotate-0 ${story.tilt}`}
            >
              <span aria-hidden="true" className={`type-display block h-[30px] text-[64px] leading-[0.7] ${story.quoteColor}`}>
                “
              </span>
              <p className="flex-1 text-base leading-[1.6] text-[#2A2420]">{story.quote}</p>
              <div className="flex items-center gap-3">
                <div className={`size-[42px] shrink-0 rounded-full flex items-center justify-center text-sm font-bold ${story.avatarColor}`}>
                  {story.initials}
                </div>
                <div className="flex-1">
                  <p className="font-bold">{story.name}</p>
                  <p className="text-[13px] text-[#6B5A4E]">{story.trek}</p>
                </div>
                <div className="text-right">
                  <p className="type-display text-[30px] leading-none text-meadow">{story.matchScore}</p>
                  <p className="text-xs text-[#6B5A4E]">Match</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social proof */}
        <div className="mt-11 flex flex-col sm:flex-row items-center gap-6 sm:gap-12 px-9 py-[22px] rounded-[20px] bg-forest text-white">
          <p className="max-w-[220px] text-[15px] leading-normal text-white/85 text-center sm:text-left">
            Join the tight-knit Himalayan trekking community
          </p>
          <div className="flex items-center gap-12">
            <div>
              <span className="type-display block text-[44px] leading-none text-lime">8-10M</span>
              <p className="text-[13px] text-white/70">Solo travellers in India</p>
            </div>
            <div>
              <span className="type-display block text-[44px] leading-none text-marigold">20%</span>
              <p className="text-[13px] text-white/70">YoY Growth</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
