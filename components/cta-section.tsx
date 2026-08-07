import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main CTA */}
        <div className="relative">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Ready to find your<br />
            <span className="text-primary">trail companion?</span>
          </h2>

          {/* Create profile */}
          <div className="mb-8">
            <Link href="/auth">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 group shadow-lg shadow-primary/20">
                Create Your Profile
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
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
          </div>
        </div>
      </div>
    </section>
  )
}
