"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Mountain,
  ArrowLeft,
  Heart,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Check,
  Zap,
  Moon,
  MessageSquare,
  Music,
  Camera,
  Coffee,
  Utensils,
  AlertTriangle,
  Wine,
} from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"

type MatchSignal = {
  key: string
  label: string
  icon: React.ElementType
  score: number
}

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

// Order matches CLAUDE.md's weighted matching logic (Stamina -> Risk).
// Field names match the columns returned by the match_trekkers() RPC.
const SIGNAL_DEFS: { key: string; label: string; icon: React.ElementType; field: string }[] = [
  { key: "stamina", label: "Trail Stamina", icon: Mountain, field: "stamina_score" },
  { key: "pace", label: "Walking Pace", icon: Zap, field: "pace_score" },
  { key: "breaks", label: "Rest Stops", icon: Coffee, field: "breaks_score" },
  { key: "morning", label: "Morning Person", icon: Moon, field: "morning_score" },
  { key: "dietary", label: "Dietary", icon: Utensils, field: "dietary_score" },
  { key: "music", label: "Music", icon: Music, field: "music_score" },
  { key: "chat", label: "Social Vibe", icon: MessageSquare, field: "chat_score" },
  { key: "photos", label: "Photography", icon: Camera, field: "photos_score" },
  { key: "habits", label: "Smoking/Drinking", icon: Wine, field: "smoking_drinking_score" },
  { key: "risk", label: "Risk Style", icon: AlertTriangle, field: "risk_score" },
]

// Highest, lowest, 2nd highest, 2nd lowest — per-match, not a fixed field order.
function getQuickSignals(signals: MatchSignal[]): MatchSignal[] {
  const sorted = [...signals].sort((a, b) => b.score - a.score)
  const n = sorted.length
  return [sorted[0], sorted[n - 1], sorted[1], sorted[n - 2]]
}

// trek_destination is stored as a slug (e.g. "kareri-lake") — display form
// only, matching the dropdown options in app/create-profile/page.tsx.
function formatTrekDestination(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

type FilterKey = "all" | "80plus" | "same-trek" | "same-city"

export default function MatchesPage() {
  const router = useRouter()
  const [matches, setMatches] = useState<Match[]>([])
  const [myProfile, setMyProfile] = useState<{ city: string; trekDestination: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterKey>("all")

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.replace("/auth")
        return
      }

      const [{ data: me, error: meError }, { data: rows, error: rpcError }] = await Promise.all([
        supabase.from("profiles").select("city, trek_destination").eq("id", user.id).single(),
        supabase.rpc("match_trekkers", { requesting_user_id: user.id }),
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

      setMyProfile({ city: me.city, trekDestination: me.trek_destination })
      setMatches(
        (rows ?? []).map((row: Record<string, number | string>) => ({
          id: row.match_id as string,
          name: row.name as string,
          age: row.age as number,
          city: row.city as string,
          trekDestination: row.trek_destination as string,
          overallScore: row.overall_score as number,
          connectionSent: false,
          signals: SIGNAL_DEFS.map((def) => ({
            key: def.key,
            label: def.label,
            icon: def.icon,
            score: row[def.field] as number,
          })),
        }))
      )
      setLoading(false)
    }

    load()
  }, [router])

  const sendConnection = (matchId: string) => {
    setMatches(prev =>
      prev.map(match =>
        match.id === matchId
          ? { ...match, connectionSent: true }
          : match
      )
    )
  }

  const toggleExpand = (matchId: string) => {
    setExpandedMatch(prev => prev === matchId ? null : matchId)
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
          <Link href="/" className="flex items-center gap-2">
            <Mountain className="w-6 h-6 text-primary" />
          </Link>
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

        {!loading && !error && (
          <div className="space-y-4">
            {visibleMatches.map((match) => (
              <Card key={match.id} className="overflow-hidden border-border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  {/* Main card content */}
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      {/* Avatar & Score */}
                      <div className="relative">
                        <Avatar className="w-16 h-16 border-2 border-white shadow-md">
                          <AvatarImage src="" alt={match.name} />
                          <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                            {match.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full shadow">
                          {match.overallScore}%
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground truncate">{match.name}</h3>
                          <span className="text-sm text-muted-foreground">{match.age}</span>
                          <Badge variant="outline" className="text-xs">
                            {match.city}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                          <Mountain className="w-3 h-3" />
                          <span>{formatTrekDestination(match.trekDestination)}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        {match.connectionSent ? (
                          <Button size="sm" variant="outline" disabled className="gap-1">
                            <Check className="w-4 h-4" />
                            Sent
                          </Button>
                        ) : (
                          <Button size="sm" onClick={() => sendConnection(match.id)} className="gap-1">
                            <Heart className="w-4 h-4" />
                            Connect
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleExpand(match.id)}
                          className="gap-1 text-muted-foreground"
                        >
                          {expandedMatch === match.id ? (
                            <>
                              <ChevronUp className="w-4 h-4" />
                              Less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4" />
                              More
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Quick signal pills: highest, lowest, 2nd highest, 2nd lowest */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {getQuickSignals(match.signals).map((signal) => (
                        <SignalPill key={signal.key} signal={signal} />
                      ))}
                      {match.signals.length > 4 && (
                        <span className="text-xs text-muted-foreground self-center">
                          +{match.signals.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expanded signals */}
                  {expandedMatch === match.id && (
                    <div className="border-t border-border bg-muted/30 p-5 animate-in slide-in-from-top-2 duration-300">
                      <h4 className="text-sm font-medium text-foreground mb-4">Compatibility Breakdown</h4>
                      <div className="grid gap-3">
                        {match.signals.map((signal) => (
                          <SignalRow key={signal.key} signal={signal} />
                        ))}
                      </div>

                      {!match.connectionSent && (
                        <div className="mt-6 pt-4 border-t border-border">
                          <Button onClick={() => sendConnection(match.id)} className="w-full gap-2">
                            <MessageCircle className="w-4 h-4" />
                            Send Request
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
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

function getScoreTier(score: number): "high" | "mid" | "low" {
  if (score >= 90) return "high"
  if (score >= 60) return "mid"
  return "low"
}

function SignalPill({ signal }: { signal: MatchSignal }) {
  const colors = {
    high: "bg-green-100 text-green-700 border-green-200",
    mid: "bg-yellow-100 text-yellow-700 border-yellow-200",
    low: "bg-red-100 text-red-700 border-red-200",
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${colors[getScoreTier(signal.score)]}`}>
      <signal.icon className="w-3 h-3" />
      <span>{signal.label}</span>
      <span className="font-bold">{Math.round(signal.score)}%</span>
    </div>
  )
}

function SignalRow({ signal }: { signal: MatchSignal }) {
  const textColors = {
    high: "text-green-600",
    mid: "text-yellow-600",
    low: "text-red-600",
  }
  const barColors = {
    high: "bg-green-500",
    mid: "bg-yellow-500",
    low: "bg-red-500",
  }
  const tier = getScoreTier(signal.score)

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 w-40">
        <signal.icon className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-foreground">{signal.label}</span>
      </div>
      <div className="flex-1 flex items-center gap-3">
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${barColors[tier]}`}
            style={{ width: `${signal.score}%` }}
          />
        </div>
        <span className={`text-sm font-semibold w-12 text-right ${textColors[tier]}`}>
          {Math.round(signal.score)}%
        </span>
      </div>
    </div>
  )
}
