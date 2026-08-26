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
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <span className="text-3xl">📧</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Check your email</h1>
            <p className="text-muted-foreground">
              We sent a confirmation link to{" "}
              <span className="font-medium text-foreground">{email}</span>.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Click the link in the email to activate your account, then come back and log in.
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => { setPhase("form"); setMode("login") }}
          >
            Back to login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2">
            <Mountain className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-foreground">SoloSaathi</span>
          </Link>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {mode === "signup" ? "Create your account" : "Welcome back"}
            </h1>
            <p className="text-muted-foreground">
              {hasPendingProfile
                ? "One last step — create an account to save your profile and see your matches"
                : mode === "signup"
                  ? "Join solo trekkers finding their trail companions"
                  : "Log in to find your trail companions"}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="py-5"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <Input
                type="password"
                placeholder={mode === "signup" ? "At least 6 characters" : "Your password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="py-5"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            onClick={mode === "signup" ? handleSignUp : handleLogin}
            disabled={!email || password.length < 6 || loading}
            className="w-full"
            size="lg"
          >
            {loading
              ? (hasPendingProfile ? "Saving profile…" : mode === "signup" ? "Creating account…" : "Logging in…")
              : (hasPendingProfile ? "Save Profile & Find Matches" : mode === "signup" ? "Create Account" : "Log In")}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {mode === "signup" ? "Already have an account?" : "New to SoloSaathi?"}{" "}
            <button
              onClick={() => switchMode(mode === "signup" ? "login" : "signup")}
              className="text-primary font-medium hover:underline"
            >
              {mode === "signup" ? "Log in" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
