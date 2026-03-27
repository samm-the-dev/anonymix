# Trigger Map — Suggest Mode Design Log

**Date:** 2026-03-24
**Mode:** Suggest
**Project:** Anonymix

---

## Layer 1: WDS Form Learned

**Sources loaded:**
- `wds-2-trigger-mapping/data/business-goals-template.md` — 3-tier goal structure (Primary/Secondary/Tertiary), flywheel model
- `wds-2-trigger-mapping/data/key-insights-structure.md` — Key insights structure with design implications and emotional transformation
- `wds-2-trigger-mapping/data/quality-checklist.md` — 13-section quality verification checklist
- `wds-2-trigger-mapping/data/mermaid-formatting-guide.md` — LR flowchart, node formatting, styling classes
- `_bmad/wds/data/agent-guides/saga/trigger-mapping.md` — Core methodology: 4-layer architecture, WHAT+WHY+WHEN driving forces, Feature Impact scoring

**Key internalized patterns:**
- Business Goals: 3 visionary goals, 3 SMART objectives each, hierarchical (Primary → Prerequisites)
- Personas: Deep psychological profiles, not demographics. Usage context with access/emotional state/behavior/criteria/outcome
- Driving Forces: Positive (wants) + Negative (fears), specific not vague, WHAT+WHY+WHEN pattern
- Prioritization: Frequency × Intensity × Fit scoring (1-5 each, max 15)
- No solutions on the map — psychology only
- 3-4 target groups max, 3 drivers per category per persona on diagram

## Layer 2: Project Context (Initial)

**Product Brief extracted:**
- Vision: Music sharing app for friends — themed rounds, anonymous submissions, positive discovery
- Positioning: Platform-agnostic (Spotify + YouTube Music), discovery over competition, no ads
- Primary user: Music Sharer (friend group member, 5-15 people)
- Secondary user: Session Host (creates sessions, writes prompts, manages group)
- Business model: Free MVP → optional subscription if public. No ads ever.
- Success: Session participation growth, tape turnaround speed, host expansion
- Constraints: No budget (free-tier), PWA, mobile-first, no timeline pressure
- Differentiators: No platform lock-in, no ads, resonance over ranking, playlist as artifact

**Seed document context:**
- Terminology: Session (league), Tape (round)
- Game loop: Create → Submit → Reveal → Vote/Comment → Scores → Playlist
- Auth: Spotify OAuth or Google OAuth → Firebase Auth
- Backend: Firestore + Cloud Functions + Firebase Auth

## Layer 3: Domain Research

**Music League UX pain points (web research):**
- Ads: Described as making app "completely unusable," endless ad loops crash the app
- Auth: Users kicked out, login loops, Spotify auth failures
- Mobile app: "Great idea / terrible app" — fun game, awful execution
- Spotify-only: Excludes YouTube Music users entirely
- Competition focus: Some users feel pressure from scoring/ranking

**Social music sharing psychology (web research):**
- Music sharing is identity expression — "shows where we belong in social landscape"
- Social inclusion and belonging are core psychological needs fulfilled
- Stronger/reciprocal ties facilitate engagement — intimate friend groups are ideal
- Social recommendations outperform algorithmic ones for novel/relevant discovery
- Games + social networking = higher engagement and repeat visits
- Co-listening increases engagement significantly

**Key insight for Anonymix:**
- The friend-group intimacy is the product's biggest strength — small trusted circles maximize the social bonding effect
- Anonymous voting removes social bias, making the reveal a genuine social moment
- The playlist-as-artifact gives lasting value beyond the game loop
- No-ads positioning is a massive differentiator given Music League's UX problems

---

## Step Progress

### Step 1: Business Goals
- Status: Generating...
