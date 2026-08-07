"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  ChevronDown,
  ChevronUp,
  Mountain,
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

export type MatchSignal = {
  key: string
  label: string
  icon: React.ElementType
  score: number
}

// Order matches CLAUDE.md's weighted matching logic (Stamina -> Risk).
// Field names match the *_score columns returned by both the
// match_trekkers and get_my_connection_requests RPCs.
export const SIGNAL_DEFS: { key: string; label: string; icon: React.ElementType; field: string }[] = [
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

export function buildSignals(row: Record<string, number | string | null>): MatchSignal[] {
  return SIGNAL_DEFS.map((def) => ({
    key: def.key,
    label: def.label,
    icon: def.icon,
    score: (row[def.field] as number) ?? 0,
  }))
}

// trek_destination is stored as a slug (e.g. "kareri-lake") — display form
// only, matching the dropdown options in app/create-profile/page.tsx.
export function formatTrekDestination(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// Highest, lowest, 2nd highest, 2nd lowest — per-card, not a fixed field order.
function getQuickSignals(signals: MatchSignal[]): MatchSignal[] {
  const sorted = [...signals].sort((a, b) => b.score - a.score)
  const n = sorted.length
  return [sorted[0], sorted[n - 1], sorted[1], sorted[n - 2]]
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

export function CompatibilityCard({
  name,
  age,
  city,
  trekDestination,
  overallScore,
  signals,
  actions,
  expandedFooter,
}: {
  name: string
  age: number
  city: string
  trekDestination: string
  overallScore: number
  signals: MatchSignal[]
  /** Rendered top-right, next to the More/Less toggle (e.g. Connect, Accept/Decline, email copy). */
  actions?: React.ReactNode
  /** Optional full-width content at the bottom of the expanded panel (e.g. a repeated CTA). */
  expandedFooter?: React.ReactNode
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="overflow-hidden border-border shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-5">
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <Avatar className="w-16 h-16 border-2 border-white shadow-md">
                <AvatarImage src="" alt={name} />
                <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                  {name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full shadow">
                {overallScore}%
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                <h3 className="font-semibold text-foreground truncate max-w-full">{name}</h3>
                <span className="text-sm text-muted-foreground shrink-0">{age}</span>
                <Badge variant="outline" className="text-xs shrink-0">
                  {city}
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground min-w-0">
                <Mountain className="w-3 h-3 shrink-0" />
                <span className="truncate">{formatTrekDestination(trekDestination)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {getQuickSignals(signals).map((signal) => (
              <SignalPill key={signal.key} signal={signal} />
            ))}
            {signals.length > 4 && (
              <span className="text-xs text-muted-foreground self-center">
                +{signals.length - 4} more
              </span>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-border/50">
            {actions}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setExpanded(prev => !prev)}
              className="gap-1 text-muted-foreground"
            >
              {expanded ? (
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

        {expanded && (
          <div className="border-t border-border bg-muted/30 p-5 animate-in slide-in-from-top-2 duration-300">
            <h4 className="text-sm font-medium text-foreground mb-4">Compatibility Breakdown</h4>
            <div className="grid gap-3">
              {signals.map((signal) => (
                <SignalRow key={signal.key} signal={signal} />
              ))}
            </div>
            {expandedFooter}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
