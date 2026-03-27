# 02: The Casual's First Session

**Project:** Anonymix
**Created:** 2026-03-24
**Method:** Whiteport Design Studio (WDS)
**Design Intent:** C (Discuss)
**Design Status:** not-started

---

## Transaction (Q1)

**What this scenario covers:**
Go from invite link to ready-to-play — join a friend's session, create an account, and link a music platform with zero confusion.

---

## Business Goal (Q2)

**Goal:** Active Participation — removing barriers to entry
**Objective:** Every person who drops off during onboarding is a player the group never gets.

---

## User & Situation (Q3)

**Persona:** The Casual (Secondary)
**Situation:** Early 30s, scrolling their phone during a break. A friend just dropped an invite link in the group chat with "we're doing this instead of Music League now." They're curious but not invested — if it's easy they'll join, if it's not they'll say "I'll do it later" and never will.

---

## Driving Forces (Q4)

**Hope:** Be part of the group thing their friends are excited about without it becoming a task.

**Worry:** Getting stuck in a signup maze — too many screens, too many decisions, having to figure out how to connect their music app.

---

## Device & Starting Point (Q5 + Q6)

**Device:** Mobile
**Entry:** Taps an invite link shared in a group chat (WhatsApp, iMessage, Discord), opens in mobile browser or PWA.

---

## Best Outcome (Q7)

**User Success:**
Account created, Spotify or YouTube Music linked, landed inside the session with their friends — total time under 2 minutes, felt effortless.

**Business Success:**
New player onboarded and inside a session — ready to participate in the next tape. Participation pool grows by one.

---

## Shortest Path (Q8)

1. **Join / Invite Landing** — Sees the session name, who invited them, taps to join
2. **Auth / Sign Up** — Creates account with minimal friction (social auth or email)
3. **Platform Link** — Connects Spotify or YouTube Music
4. **Profile / Account** — Lands on their profile, sees they're set up and part of the session ✓

---

## Trigger Map Connections

**Persona:** The Casual (Secondary)

**Driving Forces Addressed:**
- ✅ **Want:** Participate without effort (14)
- ❌ **Fear:** Too many steps to participate (14)

**Business Goal:** Active Participation — removing barriers to entry

---

## Scenario Steps

| Step | Folder | Purpose | Exit Action |
|------|--------|---------|-------------|
| 02.1 | `02.1-invite-landing/` | See what they're joining, tap to join | Taps join button |
| 02.2 | `02.2-auth-sign-up/` | Create account + link music platform (one OAuth flow) | Completes sign up, auto-joins session → lands in session view ✓ |

**Removed steps:**
- ~~02.3 Platform Link~~ — merged into 02.2 (Auth). OAuth handles both account creation and platform linking.
- ~~02.4 Profile/Account~~ — removed from onboarding. Post-auth lands in session view, not profile. Profile is a shared/global page accessible from anywhere via avatar tap.

**First step** (02.1) includes full entry context (Q3 + Q4 + Q5 + Q6).
**On-step interactions** (that don't leave the step) are documented as storyboard items within each page spec.
