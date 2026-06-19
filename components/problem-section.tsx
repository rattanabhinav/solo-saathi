import { Card, CardContent } from "@/components/ui/card"
import { Heart, Zap, Shield, Users } from "lucide-react"

const problems = [
  {
    icon: Heart,
    title: "Autonomy Without Isolation",
    description: "You want to go solo — no compromise on pace or itinerary. But you shouldn't go entirely alone."
  },
  {
    icon: Zap,
    title: "Safety & Support",
    description: "Someone to pull you out if altitude sickness hits. Emotional support on hard days. Real backup."
  },
  {
    icon: Users,
    title: "Cost Sharing",
    description: "Split the jeep, share the homestay. Solo identity, shared expenses."
  },
  {
    icon: Shield,
    title: "Not Random Strangers",
    description: "Existing solutions are unstructured forums with zero compatibility signal. We fix that."
  }
]

export function ProblemSection() {
  return (
    <section className="py-24 px-6 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">The Problem</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-4 mb-6 text-balance">
            Solo trekkers want autonomy but not isolation
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            {"\"Solo by identity, not entirely alone by necessity.\" The existing solutions don't get this."}
          </p>
        </div>

        {/* Problem cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {problems.map((problem, index) => (
            <Card key={index} className="bg-white border-border hover:border-primary/50 transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <problem.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{problem.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{problem.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quote */}
        <div className="mt-16 text-center">
          <blockquote className="text-xl md:text-2xl font-medium text-foreground italic">
            {"\"Friends on rent, not co-travellers\""}
          </blockquote>
          <p className="text-muted-foreground mt-4">The value is psychological safety before the trip begins</p>
        </div>
      </div>
    </section>
  )
}
