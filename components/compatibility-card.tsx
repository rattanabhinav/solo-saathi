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
    high: "bg-[#E7F7EE] text-[#166A3A] border-[#BDEBD0]",
    mid: "bg-[#FEF7D7] text-[#8A5208] border-[#F3E1A0]",
    low: "bg-[#FDEAEA] text-[#B42318] border-[#F6C6C6]",
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-[11px] sm:px-3 py-1 rounded-full text-[13px] border whitespace-nowrap ${colors[getScoreTier(signal.score)]}`}>
      <signal.icon className="size-3.5" />
      <span>{signal.label}</span>
      <span className="font-bold">{Math.round(signal.score)}%</span>
    </div>
  )
}

function SignalRow({ signal }: { signal: MatchSignal }) {
  const textColors = {
    high: "text-[#1F7A44]",
    mid: "text-[#A2650A]",
    low: "text-[#C42B1F]",
  }
  const barColors = {
    high: "bg-[linear-gradient(90deg,#2FA05A,#7BD66B)]",
    mid: "bg-[linear-gradient(90deg,#F0A92E,#FFC15E)]",
    low: "bg-[linear-gradient(90deg,#E0453A,#FF7A59)]",
  }
  const tier = getScoreTier(signal.score)

  return (
    <div className="flex items-center gap-2.5 sm:gap-3">
      <div className="flex items-center gap-2.5 sm:gap-3 w-[151px] sm:w-[180px] shrink-0">
        <signal.icon className="size-[17px] sm:size-[18px] shrink-0 text-[#4A5F5B]" />
        <span className="text-[14px] sm:text-[15px] text-[#1F2D2A]">{signal.label}</span>
      </div>
      <div className="flex-1 flex items-center gap-2.5 sm:gap-3">
        <div className="flex-1 h-2 bg-[#E3EAEF] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${barColors[tier]}`}
            style={{ width: `${signal.score}%` }}
          />
        </div>
        <span className={`text-[14px] sm:text-[15px] font-bold w-[42px] sm:w-[46px] text-right ${textColors[tier]}`}>
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
  vibeSummary,
}: {
  name: string
  age: number
  city: string
  trekDestination: string
  overallScore: number
  signals: MatchSignal[]
  /** Rendered top-right, next to the More/Less toggle (e.g. Connect, Accept/Decline, email copy). */
  actions?: React.ReactNode
  /** Optional "Why you may vibe" panel, shown between the signal pills and the actions row. */
  vibeSummary?: React.ReactNode
  /** Optional full-width content at the bottom of the expanded panel (e.g. a repeated CTA). */
  expandedFooter?: React.ReactNode
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    // Phones (under 640px) follow the mobile mockup; wider screens the desktop one
    <Card className="gap-0 py-0 overflow-hidden rounded-[20px] sm:rounded-[22px] border-0 text-forest shadow-[0_14px_32px_rgba(11,26,60,0.12)] sm:shadow-[0_18px_40px_rgba(11,26,60,0.12)] hover:shadow-[0_22px_48px_rgba(11,26,60,0.16)] transition-shadow">
      <CardContent className="p-0">
        <div className="p-[18px] sm:p-6 flex flex-col gap-3.5">
          <div className="flex items-start gap-3.5 sm:gap-[18px]">
            {/* Avatar inside a marigold → lime ring, score badge below it */}
            <div className="relative shrink-0 size-[58px] sm:size-16 rounded-full p-[3px] bg-[linear-gradient(135deg,#FFC15E,#B8F26B)]">
              <Avatar className="size-full">
                <AvatarImage src="" alt={name} />
                <AvatarFallback className="bg-[#E3F2EC] text-meadow text-lg sm:text-xl font-bold">
                  {name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="absolute left-1/2 -bottom-[9px] -translate-x-1/2 whitespace-nowrap bg-meadow text-white text-[11px] sm:text-xs font-bold px-2 sm:px-[9px] py-0.5 rounded-full border-2 border-white">
                {overallScore}%
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-x-[7px] sm:gap-x-2 gap-y-1 mt-1">
                <h3 className="text-[17px] sm:text-lg font-bold truncate max-w-full">{name}</h3>
                <span className="text-[15px] text-gray-500 shrink-0">{age}</span>
                <Badge variant="outline" className="text-[12px] sm:text-[13px] font-normal px-[9px] sm:px-2.5 py-0.5 rounded-full border-gray-300 shrink-0">
                  {city}
                </Badge>
              </div>
              <div className="flex items-center gap-1.5 mt-1.5 text-sm text-gray-500 min-w-0">
                <Mountain className="size-[15px] shrink-0" />
                <span className="truncate">{formatTrekDestination(trekDestination)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-1">
            {getQuickSignals(signals).map((signal) => (
              <SignalPill key={signal.key} signal={signal} />
            ))}
            {signals.length > 4 && (
              <span className="text-sm text-gray-500 self-center">
                +{signals.length - 4} more
              </span>
            )}
          </div>

          {vibeSummary && <div>{vibeSummary}</div>}

          {/* flex-wrap: on very narrow phones, More drops to its own line
              instead of pushing the buttons off the card */}
          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-2.5">
            {actions}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setExpanded(prev => !prev)}
              className="h-11 px-2 sm:px-2.5 has-[>svg]:px-2 sm:has-[>svg]:px-2.5 gap-2 sm:gap-1.5 text-[15px] leading-[calc(1.25/0.875)] text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              {expanded ? (
                <>
                  <ChevronUp className="size-5" />
                  Less
                </>
              ) : (
                <>
                  <ChevronDown className="size-5" />
                  More
                </>
              )}
            </Button>
          </div>
        </div>

        {expanded && (
          <div className="border-t border-[#E5E9EF] bg-[#F7FAFC] p-[18px] sm:px-6 sm:py-[22px] animate-in slide-in-from-top-2 duration-300">
            <h4 className="type-display text-[19px] sm:text-xl tracking-[0.02em] mb-3.5 sm:mb-4">Compatibility Breakdown</h4>
            {/* One column on phones; on wider screens two columns of 5
                (the 10 signals in SIGNAL_DEFS), filled top to bottom */}
            <div className="grid gap-3 md:grid-cols-2 md:grid-rows-5 md:grid-flow-col md:gap-x-10">
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
