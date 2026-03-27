# Story: Session Home — Section 1: Page Shell + Layout

**Status:** Complete
**Completed:** 2026-03-25
**Summary:** Page shell, header, two collapsible sections (active open, completed collapsed) with smooth toggle animation. No issues.

## Purpose
Create the mobile viewport container and collapsible section structure that all session cards will sit inside.

## Specifications Reference
- `01.1-session-home.md` — Session Home page spec
- `Session-Home-Work.yaml` — Section 1 definition

## Objects

### page-shell
- **Type:** Container
- **Behavior:** Fixed mobile viewport, scrollable content area, light theme
- **States:** Default only

### collapsible-section (×2)
- **Type:** Interactive container
- **Label:** "Active" (with count), "Completed" (with count)
- **Behavior:** Tap header to toggle expand/collapse with smooth height transition
- **States:**
  - Open: header visible, content visible, chevron points down
  - Collapsed: header visible, content hidden, chevron points right

## HTML Structure

```
<body>
  <div id="app">                          <!-- page shell -->
    <header>                              <!-- app header -->
      <h1>Anonymix</h1>                   <!-- app name / logo placeholder -->
    </header>
    <main>                                <!-- scrollable content -->
      <section data-section="active">     <!-- collapsible: active -->
        <button class="section-header">
          <span>Active</span>
          <span class="count">(1)</span>
          <svg class="chevron">...</svg>
        </button>
        <div class="section-content">
          <!-- session cards go here in later sections -->
        </div>
      </section>
      <section data-section="completed">  <!-- collapsible: completed -->
        <button class="section-header">
          <span>Completed</span>
          <span class="count">(1)</span>
          <svg class="chevron">...</svg>
        </button>
        <div class="section-content">
          <!-- session cards go here in later sections -->
        </div>
      </section>
    </main>
  </div>
</body>
```

## Tailwind Classes

- **Body:** `bg-gray-100 text-gray-900 min-h-screen`
- **App container:** `max-w-[428px] mx-auto min-h-screen bg-white`
- **Header:** `px-4 py-3 border-b border-gray-200`
- **H1:** `text-lg font-semibold`
- **Section header button:** `w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-sm font-semibold text-gray-700`
- **Count badge:** `text-gray-400 font-normal`
- **Chevron:** `w-4 h-4 text-gray-400 transition-transform duration-200` (rotate-90 when collapsed)
- **Section content:** `transition-all duration-200 overflow-hidden`

## JavaScript Requirements

### Functions
- `toggleSection(sectionEl)` — toggle expand/collapse, animate height, rotate chevron
- `initSections()` — set initial states (active=open, completed=collapsed)

### State
- Section open/closed tracked via `data-expanded="true|false"` attribute

## Demo Data
- Count values hardcoded for now: Active (1), Completed (1)
- No session cards rendered yet — just the section containers with placeholder text

## Acceptance Criteria

### Agent-Verifiable (Puppeteer)
- [ ] Page renders at 375px width without horizontal scroll
- [ ] Two section headers visible: "Active" and "Completed"
- [ ] Active section content is visible on load
- [ ] Completed section content is hidden on load
- [ ] Tapping Active header collapses it (content hidden)
- [ ] Tapping Completed header expands it (content visible)
- [ ] Chevron rotates on toggle

### User-Evaluable
- [ ] Light theme feels clean, not clinical
- [ ] Section toggle animation is smooth, not janky
- [ ] Header spacing feels balanced on mobile
- [ ] App name placement feels appropriate (placeholder for now)
