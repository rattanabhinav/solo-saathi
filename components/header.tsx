"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Mountain } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-border/50">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Mountain className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold tracking-tight text-foreground">SoloSaathi</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#how-it-works" className="text-sm font-semibold text-foreground/70 hover:text-foreground transition-colors">
            How It Works
          </Link>
          <Link href="#matching" className="text-sm font-semibold text-foreground/70 hover:text-foreground transition-colors">
            Matching
          </Link>
          <Link href="#safety" className="text-sm font-semibold text-foreground/70 hover:text-foreground transition-colors">
            Safety
          </Link>
          <Link href="#stories" className="text-sm font-semibold text-foreground/70 hover:text-foreground transition-colors">
            Stories
          </Link>
          {isLoggedIn && (
            <Link href="/requests" className="text-sm font-semibold text-foreground/70 hover:text-foreground transition-colors">
              My Connections
            </Link>
          )}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {!isLoggedIn && (
            <Link href="/auth?mode=login">
              <Button variant="ghost" className="text-sm text-foreground/70">
                Log In
              </Button>
            </Link>
          )}
          <Link href="/auth">
            <Button className="text-sm bg-primary text-primary-foreground hover:bg-primary/90">
              Create Profile
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-border">
          <div className="px-6 py-4 flex flex-col gap-4">
            <Link
              href="#how-it-works"
              className="text-sm font-semibold text-foreground/70 hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="#matching"
              className="text-sm font-semibold text-foreground/70 hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Matching
            </Link>
            <Link
              href="#safety"
              className="text-sm font-semibold text-foreground/70 hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Safety
            </Link>
            <Link
              href="#stories"
              className="text-sm font-semibold text-foreground/70 hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Stories
            </Link>
            {isLoggedIn && (
              <Link
                href="/requests"
                className="text-sm font-semibold text-foreground/70 hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                My Connections
              </Link>
            )}
            <div className="flex flex-col gap-2 pt-4 border-t border-border">
              {!isLoggedIn && (
                <Link href="/auth?mode=login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    Log In
                  </Button>
                </Link>
              )}
              <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full text-sm bg-primary text-primary-foreground">
                  Create Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
