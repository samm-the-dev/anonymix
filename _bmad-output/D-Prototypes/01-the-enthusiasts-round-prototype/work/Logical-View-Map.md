# Logical View Map — Scenario 01: The Enthusiast's Round

## View Mapping

| Logical View | ID | Scenario Steps | States |
|---|---|---|---|
| Session Home | view-a | 01.1 | Default (multi-session list with status variants) |
| Session View (Tape List) | view-b | 01.2, 01.4 | Crate-flip browse; tape card states: submitting, playlist-ready (01.4), commenting, results |
| Tape Submission | view-c | 01.3 | Empty search, autocomplete results, song selected/preview, submitted confirmation, re-entry (change submission) |
| Tape Comments | view-d | 01.5 | Comment fields in progress, comments submitted |
| Tape Reveal | view-e | 01.6 | First-visit (obfuscated → animated reveal), revisit (static results) |

## Build Order

| # | View | Complexity | Critical Path | Rationale |
|---|------|-----------|--------------|-----------|
| 1 | A: Session Home | Low | No | Establishes layout patterns, nav, color-coded status |
| 2 | B: Session View | Medium | No | Tape card + crate-flip metaphor reused across all views |
| 3 | C: Tape Submission | High | Yes | Core creative action, music search, last-submitter animation |
| 4 | D: Tape Comments | Medium | Yes | Comment interface, comment drafts |
| 5 | E: Tape Reveal | Medium-High | Yes | Reveal animation ceremony, first-visit vs revisit |

## Notes

- View B absorbs 01.4 (Playlist Ready) as a tape card state — not a separate page
- View C is the primary push-notification landing — search focused, keyboard up on entry
- View E has two distinct render modes (first-visit ceremony vs. static revisit)
- All views share: mobile-only (375-428px), gray model fidelity, English only
