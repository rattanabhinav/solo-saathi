"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mountain, ArrowLeft, Heart, MessageCircle, Check, Inbox } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { CompatibilityCard, buildSignals, type MatchSignal } from "@/components/compatibility-card"

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

export default function MatchesPage() {
  const router = useRouter()
  const [matches, setMatches] = useState<Match[]>([])
  const [myProfile, setMyProfile] = useState<{ city: string; trekDestination: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterKey>("all")
  const [sendingTo, setSendingTo] = useState<string | null>(null)
  const [sendError, setSendError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.replace("/auth")
        return
      }

      const [{ data: me, error: meError }, { data: rows, error: rpcError }, { data: requestRows }] = await Promise.all([
        supabase.from("profiles").select("city, trek_destination").eq("id", user.id).single(),
        supabase.rpc("match_trekkers", { requesting_user_id: user.id }),
        supabase.rpc("get_my_connection_requests"),
      ])

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

      setMyProfile({ city: me.city, trekDestination: me.trek_destination })
      setMatches(
        (rows ?? []).map((row: Record<string, number | string>) => ({
          id: row.match_id as string,
          name: row.name as string,
          age: row.age as number,
          city: row.city as string,
          trekDestination: row.trek_destination as string,
          overallScore: row.overall_score as number,
          connectionSent: alreadySent.has(row.match_id as string),
          signals: buildSignals(row),
        }))
      )
      setLoading(false)
    }

    load()
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <div>
              <h1 className="font-bold text-foreground">Your Matches</h1>
              <p className="text-sm text-muted-foreground">{visibleMatches.length} compatible trekkers found</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/requests" className="p-2 hover:bg-muted rounded-lg transition-colors" aria-label="Connection requests">
              <Inbox className="w-5 h-5 text-foreground" />
            </Link>
            <Link href="/" className="flex items-center gap-2 ml-1">
              <Mountain className="w-6 h-6 text-primary" />
            </Link>
          </div>
        </div>
      </header>

      {/* Filter bar */}
      <div className="sticky top-[73px] z-40 bg-background border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center gap-3 overflow-x-auto">
          <FilterBadge label="All Matches" active={filter === "all"} onClick={() => setFilter("all")} />
          <FilterBadge label="80%+ Match" active={filter === "80plus"} onClick={() => setFilter("80plus")} />
          <FilterBadge label="Same Trek" active={filter === "same-trek"} onClick={() => setFilter("same-trek")} />
          <FilterBadge label="Same City" active={filter === "same-city"} onClick={() => setFilter("same-city")} />
        </div>
      </div>

      {/* Matches list */}
      <main className="max-w-3xl mx-auto px-6 py-6">
        {loading && (
          <div className="text-center py-16 text-muted-foreground">Finding your matches…</div>
        )}

        {error && (
          <div className="text-center py-16 text-destructive">{error}</div>
        )}

        {sendError && (
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2 text-sm text-destructive">
            {sendError}
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-4">
            {visibleMatches.map((match) => (
              <CompatibilityCard
                key={match.id}
                name={match.name}
                age={match.age}
                city={match.city}
                trekDestination={match.trekDestination}
                overallScore={match.overallScore}
                signals={match.signals}
                actions={
                  match.connectionSent ? (
                    <Button size="sm" variant="outline" disabled className="gap-1">
                      <Check className="w-4 h-4" />
                      Sent
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => sendConnection(match.id)}
                      disabled={sendingTo === match.id}
                      className="gap-1"
                    >
                      <Heart className="w-4 h-4" />
                      {sendingTo === match.id ? "Sending…" : "Connect"}
                    </Button>
                  )
                }
                expandedFooter={
                  !match.connectionSent && (
                    <div className="mt-6 pt-4 border-t border-border">
                      <Button
                        onClick={() => sendConnection(match.id)}
                        disabled={sendingTo === match.id}
                        className="w-full gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
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
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Mountain className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">No matches yet</h3>
            <p className="text-muted-foreground mb-6">
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

function FilterBadge({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <Badge
      variant={active ? "secondary" : "outline"}
      onClick={onClick}
      className={`whitespace-nowrap cursor-pointer ${active ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
    >
      {label}
    </Badge>
  )
}
