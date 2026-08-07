import { Badge } from "@/components/ui/badge"
import {
  Footprints,
  Clock,
  Mountain,
  Home,
  Wallet,
  Utensils,
  Music,
  Laugh,
  AlertTriangle,
  Phone
} from "lucide-react"
import Image from "next/image"

const matchingSignals = [
  { icon: Footprints, label: "Trek Stamina", description: "Beginner to expert level" },
  { icon: Clock, label: "Pace Preference", description: "Fast, moderate, or leisurely" },
  { icon: Mountain, label: "Past Trek History", description: "Experience & altitude comfort" },
  { icon: Home, label: "Accommodation Style", description: "Tent vs homestay vs lodge" },
  { icon: Wallet, label: "Budget Range", description: "Backpacker to comfortable" },
  { icon: Utensils, label: "Food Habits", description: "Veg, non-veg, dietary needs" },
  { icon: Music, label: "Music & Vibe", description: "Playlists say a lot" },
  { icon: Laugh, label: "Humor Style", description: "Because trail banter matters" },
  { icon: AlertTriangle, label: "Risk Appetite", description: "Conservative to adventurous" },
  { icon: Phone, label: "Emergency Behaviour", description: "How you handle tough situations" },
]

export function MatchingSection() {
  return (
    <section id="matching" className="relative py-24 px-6 overflow-hidden">
      {/* Background image — on mobile this section stacks into a single tall
          column, so stretching the image across the full section height
          (via inset-0) scales it up hugely and crops it to an
          unrecognisable sliver. Cap the image's own aspect ratio to a band
          on mobile only; same image, same overlay, unchanged on desktop. */}
      <div className="absolute inset-x-0 top-0 h-[440px] md:inset-0 md:h-auto">
        <Image
          src="/images/hero-bg.png"
          alt="Himalayan mountain peaks at sunrise"
          fill
          className="object-cover object-center"
        />
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/50 to-white/90" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Deep Compatibility</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-4 mb-6 text-balance">
            Not just logistics. Real compatibility.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            We match on 10+ signals that actually matter on the trail. Because your trek buddy should get you.
          </p>
        </div>

        {/* Matching signals grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {matchingSignals.map((signal, index) => (
            <div 
              key={index} 
              className="group p-6 rounded-xl bg-white border border-border hover:border-primary/50 transition-all hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <signal.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{signal.label}</h3>
              <p className="text-sm text-muted-foreground">{signal.description}</p>
            </div>
          ))}
        </div>

        {/* Additional context */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-wrap justify-center gap-2">
            <Badge variant="secondary" className="text-sm">Instagram Profile Analysis</Badge>
            <Badge variant="secondary" className="text-sm">Travel Style Quiz</Badge>
            <Badge variant="secondary" className="text-sm">Mutual Interests</Badge>
            <Badge variant="secondary" className="text-sm">Schedule Compatibility</Badge>
          </div>
          <p className="text-muted-foreground mt-6 max-w-xl mx-auto">
            The value isn&apos;t logistics coordination. It&apos;s psychological safety before the trip begins.
          </p>
        </div>
      </div>
    </section>
  )
}
