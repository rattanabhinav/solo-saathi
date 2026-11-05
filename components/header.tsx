"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Mountain } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

const navLinkClass = "text-[15px] font-medium text-white/90 hover:text-lime transition-colors"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // The header is see-through over the hero's night sky (as in the mockup),
  // but the page scrolls under it into light sections where white text would
  // vanish — so it turns solid forest green once you scroll.
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const isSolid = isScrolled || isMenuOpen

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 text-white transition-colors duration-300 ${
        isSolid ? "bg-forest/90 backdrop-blur-md shadow-[0_8px_24px_rgba(6,38,29,0.25)]" : "bg-transparent"
      }`}
    >
      <nav className="max-w-[1280px] mx-auto h-[76px] px-6 lg:px-14 flex items-center gap-8">
        <Link href="/" className="type-display normal-case text-[26px] flex items-center gap-2 mr-auto">
          <Mountain className="size-[26px] text-lime" />
          SoloSaathi
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          <Link href="#how-it-works" className={navLinkClass}>
            How It Works
          </Link>
          <Link href="#matching" className={navLinkClass}>
            Matching
          </Link>
          <Link href="#safety" className={navLinkClass}>
            Safety
          </Link>
          <Link href="#stories" className={navLinkClass}>
            Stories
          </Link>
          {isLoggedIn && (
            <Link href="/requests" className={navLinkClass}>
              My Connections
            </Link>
          )}
        </div>

        <div className="hidden lg:flex items-center gap-8 ml-6">
          {!isLoggedIn && (
            <Link href="/create-profile?mode=login" className={navLinkClass}>
              Log In
            </Link>
          )}
          <Button asChild variant="lime" className="h-[42px] px-[18px] text-[15px] rounded-xl">
            <Link href="/create-profile">Create Profile</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-white/10">
          <div className="px-6 py-5 flex flex-col gap-4">
            <Link href="#how-it-works" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>
              How It Works
            </Link>
            <Link href="#matching" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>
              Matching
            </Link>
            <Link href="#safety" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>
              Safety
            </Link>
            <Link href="#stories" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>
              Stories
            </Link>
            {isLoggedIn && (
              <Link href="/requests" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>
                My Connections
              </Link>
            )}
            <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
              {!isLoggedIn && (
                <Link href="/create-profile?mode=login" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>
                  Log In
                </Link>
              )}
              <Button asChild variant="lime" className="w-full h-11 text-[15px] rounded-xl">
                <Link href="/create-profile" onClick={() => setIsMenuOpen(false)}>
                  Create Profile
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
