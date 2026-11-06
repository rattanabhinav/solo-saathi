"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mountain, Heart, MessageCircle, Check } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { AppHeader } from "@/components/app-header"
import { CompatibilityCard, buildSignals, type MatchSignal } from "@/components/compatibility-card"
import { VibeSummary } from "@/components/vibe-summary"
import { VIBE_SUMMARY_MIN_SCORE } from "@/lib/vibe/config"
import { loadVibeSummaries, type VibeState } from "@/lib/vibe/fetch-summaries"

type Match = {
  id: string
  name: string
  age: number
  city: string
  trekDestination: string
  overallScore: number
  signals: MatchSignal[]
  connectionSent: boolean
}

type FilterKey = "all" | "80plus" | "same-trek" | "same-city"

const actionButtonClass = "h-11 px-[18px] sm:px-5 has-[>svg]:px-[18px] sm:has-[>svg]:px-5 rounded-xl gap-2 text-[15px] font-bold leading-[calc(1.25/0.875)]"

export default function MatchesPage() {
  const router = useRouter()
  const [matches, setMatches] = useState<Match[]>([])
  const [myProfile, setMyProfile] = useState<{ city: string; trekDestination: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterKey>("all")
  const [sendingTo, setSendingTo] = useState<string | null>(null)
  const [sendError, setSendError] = useState<string | null>(null)
  const [vibes, setVibes] = useState<Record<string, VibeState>>({})

  useEffect(() => {
    // Set when the page unmounts (or React's dev mode re-runs this effect), so
    // a stale run stops instead of requesting Vibe Summaries a second time.
    let cancelled = false

    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (cancelled) return
      if (!user) {
        router.replace("/auth")
        return
      }

      const [{ data: me, error: meError }, { data: rows, error: rpcError }, { data: requestRows }] = await Promise.all([
        supabase.from("profiles").select("city, trek_destination").eq("id", user.id).single(),
        supabase.rpc("match_trekkers", { requesting_user_id: user.id }),
        supabase.rpc("get_my_connection_requests"),
      ])
      if (cancelled) return

      if (meError) {
        setError(meError.message)
        setLoading(false)
        return
      }
      if (rpcError) {
        setError(rpcError.message)
        setLoading(false)
        return
      }

      // A match counts as "sent" if we already have a pending or accepted
      // request to them — declined ones are excluded here so the button
      // becomes sendable again (the RPC itself also allows resending after
      // a decline, this just keeps the button in sync with that).
      const alreadySent = new Set(
        (requestRows ?? [])
          .filter((r: { direction: string; status: string }) => r.direction === "sent" && r.status !== "declined")
          .map((r: { other_id: string }) => r.other_id)
      )

      const loaded: Match[] = (rows ?? []).map((row: Record<string, number | string>) => ({
        id: row.match_id as string,
        name: row.name as string,
        age: row.age as number,
        city: row.city as string,
        trekDestination: row.trek_destination as string,
        overallScore: row.overall_score as number,
        connectionSent: alreadySent.has(row.match_id as string),
        signals: buildSignals(row),
      }))

      setMyProfile({ city: me.city, trekDestination: me.trek_destination })
      setMatches(loaded)
      setLoading(false)

      // Vibe Summaries load in the background once the list is on screen:
      // 70%+ matches only, highest score first so the top cards fill first.
      const eligible = loaded
        .filter((match) => Number(match.overallScore) >= VIBE_SUMMARY_MIN_SCORE)
        .sort((a, b) => b.overallScore - a.overallScore)
        .map((match) => match.id)
      if (eligible.length === 0) return

      const { data: { session } } = await supabase.auth.getSession()
      if (cancelled || !session) return

      setVibes(Object.fromEntries(eligible.map((id) => [id, { status: "loading" }])))
      loadVibeSummaries(
        eligible,
        session.access_token,
        (matchId, state) => setVibes((prev) => ({ ...prev, [matchId]: state })),
        () => cancelled
      )
    }

    load()
    return () => {
      cancelled = true
    }
  }, [router])

  const sendConnection = async (matchId: string) => {
    setSendError(null)
    setSendingTo(matchId)

    const { error } = await supabase.rpc("send_connection_request", { p_recipient_id: matchId })

    setSendingTo(null)

    if (error) {
      setSendError(error.message)
      return
    }

    setMatches(prev =>
      prev.map(match =>
        match.id === matchId
          ? { ...match, connectionSent: true }
          : match
      )
    )
  }

  const visibleMatches = matches
    .filter((match) => {
      if (filter === "80plus") return match.overallScore >= 80
      if (filter === "same-trek") return match.trekDestination === myProfile?.trekDestination
      if (filter === "same-city") return match.city === myProfile?.city
      return true
    })
    .sort((a, b) => b.overallScore - a.overallScore)

  return (
    <div className="bg-app-daylight min-h-screen text-forest">
      {/* Header + filter bar, pinned together while you scroll (as before) */}
      <div className="sticky top-0 z-50">
        <AppHeader backHref="/" title="Your Matches" subtitle={`${visibleMatches.length} compatible trekkers found`}>
          <Link
            href="/requests"
            className="shrink-0 min-h-9 sm:min-h-10 px-2.5 sm:px-4 rounded-full bg-white/14 border border-white/45 inline-flex items-center text-xs sm:text-sm font-semibold whitespace-nowrap hover:bg-white/25 transition-colors"
          >
            My Requests
          </Link>
          <Link href="/" aria-label="SoloSaathi home" className="shrink-0 flex items-center ml-1">
            <Mountain className="size-6 sm:size-7 text-lime" />
          </Link>
        </AppHeader>

        {/* Filter bar */}
        <div className="bg-[#EAF5FB] border-b border-[#D5E0DC]/70">
          <div className="max-w-[1008px] mx-auto px-6 py-2.5 flex items-center gap-2.5 overflow-x-auto">
            <FilterBadge label="All Matches" active={filter === "all"} onClick={() => setFilter("all")} />
            <FilterBadge label="80%+ Match" active={filter === "80plus"} onClick={() => setFilter("80plus")} />
            <FilterBadge label="Same Trek" active={filter === "same-trek"} onClick={() => setFilter("same-trek")} />
            <FilterBadge label="Same City" active={filter === "same-city"} onClick={() => setFilter("same-city")} />
          </div>
        </div>
      </div>

      {/* Matches list */}
      <main className="max-w-[1008px] mx-auto px-6 pt-[18px] pb-6 sm:pt-6">
        {loading && (
          <div className="text-center py-16 text-[#4A5F5B]">Finding your matches…</div>
        )}

        {error && (
          <div className="text-center py-16 text-destructive">{error}</div>
        )}

        {sendError && (
          <div className="mb-4 rounded-xl border border-[#F6C6C6] bg-[#FDEAEA] px-4 py-2.5 text-sm text-[#B42318]">
            {sendError}
          </div>
        )}

        {/* On phones the cards sit 16px from the screen edge (mobile mockup); the header and filters keep their 24px */}
        {!loading && !error && (
          <div className="space-y-4 sm:space-y-5 -mx-2 sm:mx-0">
            {visibleMatches.map((match) => (
              <CompatibilityCard
                key={match.id}
                name={match.name}
                age={match.age}
                city={match.city}
                trekDestination={match.trekDestination}
                overallScore={match.overallScore}
                signals={match.signals}
                vibeSummary={vibePanel(vibes[match.id])}
                actions={
                  match.connectionSent ? (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled
                      className={`${actionButtonClass} border-[#D5E0DC] text-[#4A5F5B]`}
                    >
                      <Check className="size-5" />
                      Sent
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => sendConnection(match.id)}
                      disabled={sendingTo === match.id}
                      className={`${actionButtonClass} bg-meadow hover:bg-meadow/90`}
                    >
                      <Heart className="size-5" />
                      {sendingTo === match.id ? "Sending…" : "Connect"}
                    </Button>
                  )
                }
                expandedFooter={
                  !match.connectionSent && (
                    <div className="mt-5 sm:mt-[22px]">
                      <Button
                        onClick={() => sendConnection(match.id)}
                        disabled={sendingTo === match.id}
                        className="w-full h-[50px] rounded-xl gap-2 text-[15px] font-bold bg-forest text-lime hover:bg-forest/90"
                      >
                        <MessageCircle className="size-5" />
                        {sendingTo === match.id ? "Sending…" : "Send Request"}
                      </Button>
                    </div>
                  )
                }
              />
            ))}
          </div>
        )}

        {/* Empty state placeholder */}
        {!loading && !error && visibleMatches.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-white shadow-[0_10px_24px_rgba(11,26,60,0.1)] flex items-center justify-center mx-auto mb-4">
              <Mountain className="w-8 h-8 text-meadow" />
            </div>
            <h3 className="type-display text-2xl mb-2">No matches yet</h3>
            <p className="text-[#4A5F5B] mb-6">
              {matches.length === 0
                ? "We haven't found other trekkers heading to your destination yet — check back soon."
                : "No matches fit this filter yet — try a different one."}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

// No panel for matches under 70%, or when a summary couldn't be written.
function vibePanel(state: VibeState | undefined) {
  if (!state || state.status === "unavailable") return undefined
  return <VibeSummary summary={state.status === "ready" ? state.summary : null} />
}

function FilterBadge({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <Badge
      variant={active ? "secondary" : "outline"}
      onClick={onClick}
      className={`whitespace-nowrap cursor-pointer px-4 py-2 rounded-full border text-sm transition-colors ${
        active
          ? "bg-forest border-forest text-lime font-bold"
          : "bg-white border-[#D5E0DC] text-forest font-medium hover:border-forest/40"
      }`}
    >
      {label}
    </Badge>
  )
}
