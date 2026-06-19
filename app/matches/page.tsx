"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Mountain, 
  ArrowLeft, 
  Heart, 
  MessageCircle, 
  Instagram,
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
  AlertTriangle
} from "lucide-react"
import Link from "next/link"

type MatchSignal = {
  key: string
  label: string
  icon: React.ElementType
  userValue: string
  matchValue: string
  score: number
}

type Match = {
  id: string
  name: string
  age: number
  city: string
  instagram: string
  avatar: string
  overallScore: number
  bio: string
  upcomingTrek: string
  signals: MatchSignal[]
  connectionSent: boolean
}

// Mock data for demonstration
const mockMatches: Match[] = [
  {
    id: "1",
    name: "Priya Sharma",
    age: 27,
    city: "Mumbai",
    instagram: "priya_treks",
    avatar: "",
    overallScore: 94,
    bio: "Weekend trekker, sunrise chaser. Looking for companions for Kedarkantha this December.",
    upcomingTrek: "Kedarkantha",
    connectionSent: false,
    signals: [
      { key: "stamina", label: "Trail Stamina", icon: Mountain, userValue: "Moderate", matchValue: "Moderate", score: 100 },
      { key: "pace", label: "Walking Pace", icon: Zap, userValue: "Brisk", matchValue: "Moderate", score: 85 },
      { key: "morning", label: "Morning Person", icon: Moon, userValue: "Early Bird", matchValue: "Early Bird", score: 100 },
      { key: "social", label: "Social Vibe", icon: MessageSquare, userValue: "Chatty", matchValue: "Chatty", score: 100 },
      { key: "music", label: "Music", icon: Music, userValue: "Earphones", matchValue: "Earphones", score: 100 },
      { key: "photos", label: "Photography", icon: Camera, userValue: "Occasional", matchValue: "Frequent", score: 80 },
      { key: "rest", label: "Rest Stops", icon: Coffee, userValue: "Regular", matchValue: "Regular", score: 100 },
      { key: "food", label: "Dietary", icon: Utensils, userValue: "Vegetarian", matchValue: "Vegetarian", score: 100 },
      { key: "risk", label: "Risk Style", icon: AlertTriangle, userValue: "Balanced", matchValue: "Balanced", score: 100 },
    ]
  },
  {
    id: "2",
    name: "Rahul Verma",
    age: 31,
    city: "Bangalore",
    instagram: "rahul.trails",
    avatar: "",
    overallScore: 87,
    bio: "Software engineer by day, mountain lover by weekend. Completed 15+ Himalayan treks.",
    upcomingTrek: "Hampta Pass",
    connectionSent: false,
    signals: [
      { key: "stamina", label: "Trail Stamina", icon: Mountain, userValue: "Moderate", matchValue: "Experienced", score: 75 },
      { key: "pace", label: "Walking Pace", icon: Zap, userValue: "Brisk", matchValue: "Brisk", score: 100 },
      { key: "morning", label: "Morning Person", icon: Moon, userValue: "Early Bird", matchValue: "Normal", score: 80 },
      { key: "social", label: "Social Vibe", icon: MessageSquare, userValue: "Chatty", matchValue: "Occasional", score: 75 },
      { key: "music", label: "Music", icon: Music, userValue: "Earphones", matchValue: "Nature Only", score: 85 },
      { key: "photos", label: "Photography", icon: Camera, userValue: "Occasional", matchValue: "Occasional", score: 100 },
      { key: "rest", label: "Rest Stops", icon: Coffee, userValue: "Regular", matchValue: "Minimal", score: 70 },
      { key: "food", label: "Dietary", icon: Utensils, userValue: "Vegetarian", matchValue: "Flexible", score: 90 },
      { key: "risk", label: "Risk Style", icon: AlertTriangle, userValue: "Balanced", matchValue: "Adventurous", score: 80 },
    ]
  },
  {
    id: "3",
    name: "Ananya Reddy",
    age: 25,
    city: "Hyderabad",
    instagram: "ananya.peaks",
    avatar: "",
    overallScore: 91,
    bio: "First-time solo trekker. Love photography and making new friends on trails.",
    upcomingTrek: "Brahmatal",
    connectionSent: false,
    signals: [
      { key: "stamina", label: "Trail Stamina", icon: Mountain, userValue: "Moderate", matchValue: "Moderate", score: 100 },
      { key: "pace", label: "Walking Pace", icon: Zap, userValue: "Brisk", matchValue: "Moderate", score: 85 },
      { key: "morning", label: "Morning Person", icon: Moon, userValue: "Early Bird", matchValue: "Flexible", score: 90 },
      { key: "social", label: "Social Vibe", icon: MessageSquare, userValue: "Chatty", matchValue: "Love to Talk", score: 95 },
      { key: "music", label: "Music", icon: Music, userValue: "Earphones", matchValue: "Soft Background", score: 80 },
      { key: "photos", label: "Photography", icon: Camera, userValue: "Occasional", matchValue: "Frequent", score: 80 },
      { key: "rest", label: "Rest Stops", icon: Coffee, userValue: "Regular", matchValue: "Frequent", score: 85 },
      { key: "food", label: "Dietary", icon: Utensils, userValue: "Vegetarian", matchValue: "Vegetarian", score: 100 },
      { key: "risk", label: "Risk Style", icon: AlertTriangle, userValue: "Balanced", matchValue: "Cautious", score: 85 },
    ]
  },
  {
    id: "4",
    name: "Vikram Singh",
    age: 29,
    city: "Delhi",
    instagram: "vikram.altitude",
    avatar: "",
    overallScore: 82,
    bio: "Adventure photographer seeking companions who don't mind frequent photo stops!",
    upcomingTrek: "Kedarkantha",
    connectionSent: false,
    signals: [
      { key: "stamina", label: "Trail Stamina", icon: Mountain, userValue: "Moderate", matchValue: "Experienced", score: 75 },
      { key: "pace", label: "Walking Pace", icon: Zap, userValue: "Brisk", matchValue: "Slow", score: 65 },
      { key: "morning", label: "Morning Person", icon: Moon, userValue: "Early Bird", matchValue: "Early Bird", score: 100 },
      { key: "social", label: "Social Vibe", icon: MessageSquare, userValue: "Chatty", matchValue: "Occasional", score: 75 },
      { key: "music", label: "Music", icon: Music, userValue: "Earphones", matchValue: "Nature Only", score: 85 },
      { key: "photos", label: "Photography", icon: Camera, userValue: "Occasional", matchValue: "Constant", score: 60 },
      { key: "rest", label: "Rest Stops", icon: Coffee, userValue: "Regular", matchValue: "Frequent", score: 85 },
      { key: "food", label: "Dietary", icon: Utensils, userValue: "Vegetarian", matchValue: "Non-Veg", score: 80 },
      { key: "risk", label: "Risk Style", icon: AlertTriangle, userValue: "Balanced", matchValue: "Balanced", score: 100 },
    ]
  },
]

export default function MatchesPage() {
  const [matches, setMatches] = useState(mockMatches)
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null)

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
              <p className="text-sm text-muted-foreground">{matches.length} compatible trekkers found</p>
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
          <Badge variant="secondary" className="bg-primary text-primary-foreground whitespace-nowrap">
            All Matches
          </Badge>
          <Badge variant="outline" className="whitespace-nowrap cursor-pointer hover:bg-muted">
            90%+ Match
          </Badge>
          <Badge variant="outline" className="whitespace-nowrap cursor-pointer hover:bg-muted">
            Same Trek
          </Badge>
          <Badge variant="outline" className="whitespace-nowrap cursor-pointer hover:bg-muted">
            Same City
          </Badge>
        </div>
      </div>

      {/* Matches list */}
      <main className="max-w-3xl mx-auto px-6 py-6">
        <div className="space-y-4">
          {matches.map((match) => (
            <Card key={match.id} className="overflow-hidden border-border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                {/* Main card content */}
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Avatar & Score */}
                    <div className="relative">
                      <Avatar className="w-16 h-16 border-2 border-white shadow-md">
                        <AvatarImage src={match.avatar} alt={match.name} />
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
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{match.bio}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Mountain className="w-3 h-3" />
                          <span>{match.upcomingTrek}</span>
                        </div>
                        <a 
                          href={`https://instagram.com/${match.instagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Instagram className="w-3 h-3" />
                          <span>@{match.instagram}</span>
                        </a>
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

                  {/* Quick signal pills */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {match.signals.slice(0, 4).map((signal) => (
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
                    
                    {/* Action buttons in expanded view */}
                    <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border">
                      <a 
                        href={`https://instagram.com/${match.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button variant="outline" className="w-full gap-2">
                          <Instagram className="w-4 h-4" />
                          View Profile
                        </Button>
                      </a>
                      {!match.connectionSent && (
                        <Button onClick={() => sendConnection(match.id)} className="flex-1 gap-2">
                          <MessageCircle className="w-4 h-4" />
                          Send Request
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty state placeholder */}
        {matches.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Mountain className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">No matches yet</h3>
            <p className="text-muted-foreground mb-6">Complete your profile to find compatible trekkers</p>
            <Link href="/create-profile">
              <Button>Create Profile</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}

function SignalPill({ signal }: { signal: MatchSignal }) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-emerald-100 text-emerald-700 border-emerald-200"
    if (score >= 75) return "bg-amber-100 text-amber-700 border-amber-200"
    return "bg-orange-100 text-orange-700 border-orange-200"
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getScoreColor(signal.score)}`}>
      <signal.icon className="w-3 h-3" />
      <span>{signal.label}</span>
      <span className="font-bold">{signal.score}%</span>
    </div>
  )
}

function SignalRow({ signal }: { signal: MatchSignal }) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-600"
    if (score >= 75) return "text-amber-600"
    return "text-orange-600"
  }

  const getScoreBg = (score: number) => {
    if (score >= 90) return "bg-emerald-500"
    if (score >= 75) return "bg-amber-500"
    return "bg-orange-500"
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 w-32">
        <signal.icon className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-foreground">{signal.label}</span>
      </div>
      <div className="flex-1 flex items-center gap-3">
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all ${getScoreBg(signal.score)}`}
            style={{ width: `${signal.score}%` }}
          />
        </div>
        <span className={`text-sm font-semibold w-12 text-right ${getScoreColor(signal.score)}`}>
          {signal.score}%
        </span>
      </div>
      <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground w-48">
        <span className="truncate">You: {signal.userValue}</span>
        <span>|</span>
        <span className="truncate">Them: {signal.matchValue}</span>
      </div>
    </div>
  )
}
