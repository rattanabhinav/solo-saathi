"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Skeleton } from "@/components/ui/skeleton"

// "Why you may vibe" panel on a match card (docs/features/vibe_summary.md).
// Open by default. `summary` is null while the AI note is still loading.
export function VibeSummary({ summary }: { summary: string | null }) {
  const loading = summary === null

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="vibe"
      // Thicker 1.5px green border plus a soft outer glow, so the AI note
      // stands out from the rest of the card
      className="rounded-[14px] border-[1.5px] border-meadow bg-[#F0FAF5] shadow-[0_0_0_4px_rgba(5,133,97,0.12)]"
    >
      <AccordionItem value="vibe" className="border-b-0">
        <AccordionTrigger className="items-center min-h-12 px-4 py-0 hover:no-underline [&>svg]:size-5 [&>svg]:translate-y-0 [&>svg]:text-gray-500">
          <span className="flex items-center gap-2.5">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-[9px] bg-meadow text-white">
              <AiSparkleIcon className="size-4" />
            </span>
            <span className="text-[15px] font-semibold text-gray-900">Why you may vibe</span>
          </span>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-3.5" aria-busy={loading}>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-full bg-meadow/10" />
              <Skeleton className="h-3.5 w-11/12 bg-meadow/10" />
              <Skeleton className="h-3.5 w-3/4 bg-meadow/10" />
            </div>
          ) : (
            <p className="text-sm leading-[1.6] text-gray-700">{summary}</p>
          )}
          <p className="mt-2.5 text-[12.5px] text-gray-500">
            {loading ? "Reading both your trek answers…" : "Written by AI from both your trek answers"}
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

// Generative-AI mark from the mockup: two filled four-point stars, one big
// and one small at the top right. Lucide has no filled two-star icon.
export function AiSparkleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M10 6C10.4 10.4 13.6 13.6 18 14C13.6 14.4 10.4 17.6 10 22C9.6 17.6 6.4 14.4 2 14C6.4 13.6 9.6 10.4 10 6Z" />
      <path d="M18.5 2C18.7 3.9 20.1 5.3 22 5.5C20.1 5.7 18.7 7.1 18.5 9C18.3 7.1 16.9 5.7 15 5.5C16.9 5.3 18.3 3.9 18.5 2Z" />
    </svg>
  )
}
