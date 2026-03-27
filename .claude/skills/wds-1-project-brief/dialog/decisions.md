# Decisions Log — Anonymix

## Business Model (Step 05)

**Decision:** B2C, direct to end users

**Discussion:**
- No business customers, no B2B component
- MVP is free, personal use for Sam's friend group
- If the product goes public: subscription or one-time license via Ko-fi, driven by operational costs
- Ko-fi donation link included regardless
- No ads, ever — core positioning differentiator
- Sam is open to profit but not trying to be greedy — fair compensation model

**Rationale:** Personal project with potential to grow. Monetization is cost-driven, not profit-maximizing. Anti-ad stance is a defining value.

**Implications:**
- Design for zero revenue initially
- Keep user/auth architecture flexible enough to support access gating later
- Don't over-engineer monetization for MVP
- No ad infrastructure needed, ever

## Success Criteria (Step 08)

**Primary metric:** Session participation — more people joining and staying active per session (baseline: 5 in ML, success: growth by removing platform/ad barriers)

**Secondary metrics:**
- Tape turnaround — rounds complete faster due to smoother UX (no ads, native playlists)
- Host expansion — others in the group start their own sessions because it's easy

**Timeline:** Validate with friend group within first 2-3 sessions after launch

**Key insight:** Retention/dropoff is not a problem to solve — the group already sticks with rounds. The win is removing barriers to entry (platform lock, ads) and reducing friction in the flow.

## Competitive Landscape (Step 09)

**Alternatives:**
| Alternative | Strengths | Weaknesses |
|---|---|---|
| Music League | Proven game loop, large user base, polished | Spotify-only, ads, competition-focused, broad audience UX |
| Shared playlists | Easy, built into platforms | No game structure, no prompts, no anonymity, no discussion |
| Group chat / artist recs | Zero friction | Completely unstructured, ephemeral, no curation |
| Do nothing | No effort | No discovery, no shared experience |

**Unfair advantage:** No monetization pressure = no ads ever + pure UX optimization. Small scope = fast iteration + platform flexibility. Discovery-first philosophy is a genuine design divergence from ML, not just a missing feature.

**Reality check:** If ML adds YTM — fine, Anonymix UX will still be better and can extend to other services. ML won't drop ads (it's their revenue model). ML won't drop competition focus (it drives their engagement).

## Constraints (Step 10)

**Fixed:**
- No budget — free-tier services only for now
- Spotify + YouTube Music API compliance (ToS to be reviewed)
- Avoid legal complications with Music League (no trade dress similarity)
- Auth must be easy (low friction onboarding)
- PWA (Sam has template and tooling)

**Flexible:**
- Backend stack — not locked to Firebase, open to alternatives that fit free-tier
- Real-time not required — poll/pull on app load, refresh button
- Can wrap PWA into Android app if needed
- No timeline pressure — done when it's done

**Design parameters:**
- Architecture should favor simplicity over real-time complexity
- Free-tier limits will shape data model decisions (document counts, API call quotas)
- PWA means mobile-first responsive design, not native UI components

## Platform Strategy (Step 10a)

**Platform:**
- PWA (Sam has template and tooling), mobile-first, responsive to desktop
- Android wrappable via PWA-to-APK if needed
- Interaction: touch primary, mouse/keyboard secondary

**Data strategy:** Attempt real-time updates (e.g. Firestore listeners or similar) at implementation time. If complexity or cost is prohibitive, fall back to poll-on-load with refresh button. Design the UI to work with either approach (don't depend on instant updates for correctness).

**Offline:** Not a priority. Architecturally possible (cache playlists, queue votes) — nice-to-have, not MVP.

**Accessibility:** Standard web a11y (semantic HTML, screen reader support, WCAG basics)

**Rationale:** PWA = fastest path to working product across devices with existing tooling. No app store friction. Aligns with free-tier constraint and solo developer scope.

## Tone of Voice (Step 11)

**Attributes:**
1. Minimal — say only what's needed
2. Clear — plain language, no cleverness
3. Quietly warm — approachable without performing. Human phrasing without being chatty.
4. Resonance-framed — connection language over competition language

**Examples:**
- Submit button: "Submit"
- Empty submissions: "No submissions yet"
- Vote confirmation: "Vote saved"
- Reveal moment: "Votes are in"
- Error state: "Something went wrong. Try again?"
- Score display: "Resonated with 4"

**Do's:** Be direct. Be short. Let the content speak.
**Don'ts:** Exclamation points. Emoji in system text. Cute error messages. Gamified language.

## Product Brief Synthesis (Step 12)

**Final narrative presented:** Yes, confirmed without adjustments
**Adjustments during synthesis:** None
**User confirmation:** Confirmed
**Brief generated:** _bmad-output/A-Product-Brief/project-brief.md
**Completion:** 2026-03-25
