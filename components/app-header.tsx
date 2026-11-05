import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// Dusk-sky header shared by /matches and /requests. The mockup's banner is
// 150px tall; this keeps roughly the height of the old white header so it can
// stay pinned while you scroll, with a slim ridge along the bottom edge.
export function AppHeader({
  backHref,
  title,
  subtitle,
  className = "",
  children,
}: {
  backHref: string
  title: string
  subtitle: string
  className?: string
  /** Right-hand side of the header (links, logo) */
  children?: React.ReactNode
}) {
  return (
    <header className={`bg-app-dusk relative text-white ${className}`}>
      {/* Ridge silhouette; the light bottom layer matches the page background */}
      <svg
        viewBox="0 0 1280 70"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 w-full h-[18px]"
      >
        <path d="M0 70V40l140-30 110 22 160-34 150 30 130-18 170 26 140-22 140 20 140-10V70z" fill="#5B3A7A" />
        <path d="M0 70V56l200-18 220 14 240-22 220 18 200-12 200 12V70z" fill="#EAF5FB" />
      </svg>

      <div className="relative max-w-[1008px] mx-auto px-6 pt-3 pb-[18px] flex items-center gap-2 sm:gap-[18px]">
        <Link href={backHref} aria-label="Back" className="p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors">
          <ArrowLeft className="size-6" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="type-display text-2xl sm:text-[28px] leading-none">{title}</h1>
          <p className="mt-1 text-xs sm:text-sm text-white/80">{subtitle}</p>
        </div>
        {children}
      </div>
    </header>
  )
}
