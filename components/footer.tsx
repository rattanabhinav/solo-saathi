import Link from "next/link"
import { Mountain } from "lucide-react"

const linkClass = "text-sm text-white/75 hover:text-white transition-colors"

export function Footer() {
  return (
    <footer className="pt-14 pb-8 px-6 bg-forest text-white">
      <div className="max-w-[1080px] mx-auto">
        <div className="grid grid-cols-2 gap-10 md:flex md:gap-24 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:flex-1">
            <Link href="/" className="type-display normal-case text-[26px] inline-flex items-center gap-2">
              <Mountain className="size-[26px] text-lime" />
              SoloSaathi
            </Link>
            <p className="mt-3 max-w-[360px] text-sm leading-[1.6] text-white/70">
              Pre-trip compatibility matching for self-organised solo trekkers.
              Friends on rent, not co-travellers.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-lime mb-2">Product</h4>
            <ul className="leading-8">
              <li>
                <Link href="#how-it-works" className={linkClass}>
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#matching" className={linkClass}>
                  Matching
                </Link>
              </li>
              <li>
                <Link href="#safety" className={linkClass}>
                  Safety
                </Link>
              </li>
              <li>
                <Link href="#stories" className={linkClass}>
                  Stories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lime mb-2">Company</h4>
            <ul className="leading-8">
              <li>
                <Link href="#" className={linkClass}>
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className={linkClass}>
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className={linkClass}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-5 border-t border-white/12 flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] text-white/60">
          <p>2026 SoloSaathi. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
