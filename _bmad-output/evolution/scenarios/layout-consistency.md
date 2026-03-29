# Layout Consistency

## Target
Unify the app shell across all pages into three clear tiers, eliminating duplicated header logic and inconsistent navigation patterns.

## Current State
- 5 pages inside `Layout` (app bar + bottom nav), 7 pages outside with custom or no headers
- CreateSessionPage and JoinSessionPage reimplement back button + theme toggle independently
- Tape pages (Listen/Comment, Results) show bottom nav during focused tasks
- LoginPage has a theme toggle but no branding; ProfileSetupPage has no header at all
- Privacy/Terms pages have no way back to the app

## Desired State
Three layout tiers, each providing a consistent shell:

| Tier | Component | Provides | Pages |
|------|-----------|----------|-------|
| Full chrome | `Layout` | App bar (Anonymix + theme toggle) + bottom nav | Home, Session View, Profile |
| Task chrome | `TaskLayout` | App bar (back button + Anonymix + theme toggle), no bottom nav | Create, Join, Tape pages |
| Minimal | `MinimalLayout` | Theme toggle only, centered content | Login, Profile Setup, Privacy, Terms |

**Key principle**: Task pages have no bottom nav. The user exits via back button only — explicit cancel over ambient escape.

## User Journey

### Before (inconsistent)
1. User creates a session → no app bar branding, no bottom nav (standalone page)
2. User comments on a tape → app bar + bottom nav visible (inside Layout)
3. User joins via invite → different header than create page

### After (consistent)
1. User creates a session → TaskLayout: back button + Anonymix branding + theme toggle, no bottom nav
2. User comments on a tape → TaskLayout: same shell as create
3. User joins via invite → TaskLayout: same shell

## Success Criteria
- App bar rendered from ONE component, not reimplemented per page
- Bottom nav only visible on Home, Session View, Profile
- All task pages share identical back-button app bar
- Back button logic: `navigate(-1)` for task pages, hidden for home pages
- Theme toggle accessible from every page

## Scope

### Pages affected
- `Layout.tsx` — keep as-is (full chrome)
- New `TaskLayout.tsx` — app bar with back, no bottom nav
- New `MinimalLayout.tsx` — theme toggle only
- `App.tsx` — restructure route groups
- `CreateSessionPage.tsx` — remove custom header
- `JoinSessionPage.tsx` — remove custom header
- `LoginPage.tsx` — remove custom theme toggle
- `ProfileSetupPage.tsx` — no changes (MinimalLayout wraps it)
- `PrivacyPage.tsx` — add MinimalLayout wrapper
- `TermsPage.tsx` — add MinimalLayout wrapper

### Components touched
- `Layout.tsx` (no changes needed)
- New: `TaskLayout.tsx`, `MinimalLayout.tsx`
- Remove: custom headers from Create, Join, Login pages

### Data changes
None — purely structural/visual.

### Risk level
**Low** — visual restructuring only, no behavior or data changes. Pages render the same content, just wrapped differently.
