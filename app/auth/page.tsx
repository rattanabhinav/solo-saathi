"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mountain } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { completeAuthFlow, getPendingProfile } from "@/lib/profile"

type Mode = "signup" | "login"

const cardClass =
  "relative w-full max-w-[400px] rounded-3xl bg-white p-6 sm:p-8 text-forest shadow-[0_30px_70px_rgba(11,26,60,0.45),0_0_0_6px_rgba(255,255,255,0.15)]"
const fieldClass =
  "h-[46px] rounded-xl border-[1.5px] border-[#D5E0DC] bg-[#F3F7F5] px-3.5 text-[15px] text-forest placeholder:text-[#7A8A86] focus-visible:border-meadow focus-visible:ring-meadow/20"

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthForm />
    </Suspense>
  )
}

function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<Mode>(searchParams.get("mode") === "login" ? "login" : "signup")

  // Redirect already-authenticated users to the right place
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return
      try {
        const next = await completeAuthFlow(session.user.id)
        router.replace(next)
      } catch {
        // Stay on auth page if profile save failed
      }
    })
  }, [router])
  const [phase, setPhase] = useState<"form" | "verify-email">("form")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasPendingProfile, setHasPendingProfile] = useState(false)

  useEffect(() => {
    setHasPendingProfile(!!getPendingProfile())
  }, [])

  const switchMode = (next: Mode) => {
    setMode(next)
    setError(null)
  }

  const handleSignUp = async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth`,
      },
    })
    if (error) {
      setError(error.message)
    } else if (data.session) {
      try {
        const next = await completeAuthFlow(data.session.user.id)
        router.push(next)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save profile")
      }
    } else {
      setPhase("verify-email")
    }
    setLoading(false)
  }

  const handleLogin = async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
    } else if (data.session) {
      try {
        const next = await completeAuthFlow(data.session.user.id)
        router.push(next)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save profile")
      }
    }
    setLoading(false)
  }

  if (phase === "verify-email") {
    return (
      <AuthShell>
        <div className={`${cardClass} text-center space-y-6`}>
          <span className="block text-[40px] leading-none">📧</span>
          <div>
            <h1 className="type-display text-[34px] sm:text-[38px] leading-none mb-2.5">Check your email</h1>
            <p className="text-[15px] leading-[1.55] text-[#4A5F5B]">
              We sent a confirmation link to{" "}
              <span className="font-semibold text-forest">{email}</span>.
            </p>
          </div>
          <p className="text-sm text-[#4A5F5B]">
            Click the link in the email to activate your account, then come back and log in.
          </p>
          <Button
            variant="outline"
            className="w-full h-[50px] rounded-xl border-[1.5px] border-[#D5E0DC] bg-white text-base font-bold text-forest hover:bg-[#F3F7F5] hover:text-forest"
            onClick={() => { setPhase("form"); setMode("login") }}
          >
            Back to login
          </Button>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell>
      <Link href="/" className="relative type-display normal-case text-[32px] text-white flex items-center gap-2.5">
        <Mountain className="size-8 text-lime" />
        SoloSaathi
      </Link>

      <div className={cardClass}>
        <h1 className="type-display text-[34px] sm:text-[38px] leading-none text-center">
          {mode === "signup" ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-2.5 mb-6 text-[15px] leading-[1.55] text-[#4A5F5B] text-center">
          {hasPendingProfile
            ? "One last step — create an account to save your profile and see your matches"
            : mode === "signup"
              ? "Join solo trekkers finding their trail companions"
              : "Log in to find your trail companions"}
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={fieldClass}
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">Password</label>
            <Input
              type="password"
              placeholder={mode === "signup" ? "At least 6 characters" : "Your password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={fieldClass}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
            />
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

        <Button
          variant="lime"
          onClick={mode === "signup" ? handleSignUp : handleLogin}
          disabled={!email || password.length < 6 || loading}
          className="w-full mt-[22px] h-[50px] rounded-xl text-base"
        >
          {loading
            ? (hasPendingProfile ? "Saving profile…" : mode === "signup" ? "Creating account…" : "Logging in…")
            : (hasPendingProfile ? "Save Profile & Find Matches" : mode === "signup" ? "Create Account" : "Log In")}
        </Button>

        <p className="mt-[18px] text-center text-sm text-[#4A5F5B]">
          {mode === "signup" ? "Already have an account?" : "New to SoloSaathi?"}{" "}
          <button
            onClick={() => switchMode(mode === "signup" ? "login" : "signup")}
            className="text-meadow font-bold hover:underline"
          >
            {mode === "signup" ? "Log in" : "Sign up"}
          </button>
        </p>
      </div>
    </AuthShell>
  )
}

// Sunset sky from the mockup: stars, a rising sun and three mountain ridges.
// Shared by the login/sign-up form and the "check your email" screen.
function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-auth-sky relative min-h-screen overflow-hidden flex flex-col items-center justify-center gap-6 px-6 py-12">
      <div aria-hidden="true" className="sun-glow absolute left-1/2 -bottom-[120px] size-[520px] -translate-x-1/2" />
      <svg
        viewBox="0 0 1280 260"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 w-full h-[160px] sm:h-[260px]"
      >
        <path d="M0 260V130l120-50 90 34 160-90 120 66 110-40 150 74 140-100 130 58 120-34 140 66V260z" fill="#5B3A7A" />
        <path d="M0 260V176l150-56 110 40 170-72 160 80 130-32 160 56 140-48 260 72V260z" fill="#0F4C4A" />
        <path d="M0 260V222l200-32 180 24 220-48 200 40 180-24 300 32V260z" fill="#06261D" />
      </svg>
      {children}
    </div>
  )
}
