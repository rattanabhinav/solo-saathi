# Feature - AI Vibe Summary (AI Match Reasoning)

## Problem
- When users see match % with their potential matches, it doesn't tell them much of value
- It has logic but not intelligence

## Solution
- AI Vibe Summary is a human-readable reasoning or explanation, written by AI, of WHY 2 solo trekkers may or may not be a suitable match for each other
- It goes beyond the match % score and reads both profiles (all matching signals) to generate 3-4 sentences
- It should look like a veteran trekker who knows both trekkers and introduces the user to its matches hence, building trust and confidence
- This is the psychological safety and trust SoloSaathi needs to own

## Design
- A collapsable accordion titled "Why you may vibe" with sparkling AI icon (default: expanded)
- Place it on match's card, shown in mockup
- Follow the website design style for typgraphy, colours, look and feel

## Generation Trigger
- As soon as a user has compatible matches to view, fetch with other match data
- Only for `atleast 70% match %` matches
- Trigger in the background without needing any additional user input or API call
- SHOULD NOT block match algorithm function or delay user for seeing his matches, run it asynchronously in the background if needed

## Tone
- Write 3-4 sentences like a seasoned trekker who has done numerous treks and genuinely cares about the users' safety and experience
- Show genuine intent of building user's trust in his matches
- ALWAYS warm, honest, direct, transparent, trek-specific, accurate
- NEVER generic ("you both like to trek"), flattery, pushy, sugar-coatery, incorrect
- Highlight strongest compatibility factors ("you both tend to wait and analyse the situation with calmness when things go south")
- Try to flag atleast 1 possible friction point in every summary, not to discourage but to place correct expectations

## Output Structure 
3-4 sentences, 50-80 words
1. The strongest compatibility matching signal and what it means on the trek
2. The secondary signals
3. One honest tension point or "align before you go" note
- The prompt asks for ~50 words, but up to 80 is accepted so almost every summary needs only one AI call (saves time and cost)
- Under 45 or over 80 words → AI gets one rewrite; if still off, no summary is shown for that match

## API model
Always use claude-sonnet-5-5