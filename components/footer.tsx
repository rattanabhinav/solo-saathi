import Link from "next/link"
import { Mountain } from "lucide-react"

export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-border bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <Mountain className="w-6 h-6 text-primary" />
              <span className="text-2xl font-bold text-foreground">SoloSaathi</span>
            </Link>
            <p className="text-muted-foreground mt-4 max-w-sm">
              Pre-trip compatibility matching for self-organised solo trekkers.
              Friends on rent, not co-travellers.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#matching" className="text-muted-foreground hover:text-foreground transition-colors">
                  Matching
                </Link>
              </li>
              <li>
                <Link href="#safety" className="text-muted-foreground hover:text-foreground transition-colors">
                  Safety
                </Link>
              </li>
              <li>
                <Link href="#stories" className="text-muted-foreground hover:text-foreground transition-colors">
                  Stories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            2026 SoloSaathi. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
