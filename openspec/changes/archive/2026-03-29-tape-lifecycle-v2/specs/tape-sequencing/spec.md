## ADDED Requirements

### Requirement: Tape sequencing via upcoming status
Tapes SHALL be created in `upcoming` status except for the first tape in a session, which starts in `submitting`. Only one tape per session SHALL be in `submitting` or `playlist_ready` at a time.

#### Scenario: Session creation with 3 tapes
- **WHEN** host creates a session with 3 tapes
- **THEN** tape 1 SHALL be `submitting` and tapes 2-3 SHALL be `upcoming`

### Requirement: Auto-advance chain
When a tape transitions to `results` or `skipped`, the next tape in the session (by creation order) with status `upcoming` SHALL automatically advance to `submitting`.

#### Scenario: Tape completes, next starts
- **WHEN** tape 1 reaches `results`
- **THEN** tape 2 SHALL automatically transition from `upcoming` to `submitting`

#### Scenario: Tape skipped, next starts
- **WHEN** tape 1 is `skipped`
- **THEN** tape 2 SHALL automatically transition from `upcoming` to `submitting`

#### Scenario: Last tape completes
- **WHEN** the final tape reaches `results` and no `upcoming` tapes remain
- **THEN** no further transitions SHALL occur

### Requirement: TapePage routing by status
The tape page SHALL render appropriate content based on tape status:
- `submitting` or `upcoming`: redirect to session view
- `playlist_ready`: ListenCommentPage
- `results`: ResultsPage
- `skipped`: a simple "Skipped" display with tape title and "No submissions this round"

#### Scenario: Navigate to upcoming tape
- **WHEN** user navigates to a tape URL for an `upcoming` tape
- **THEN** they SHALL be redirected to the session view

#### Scenario: Navigate to skipped tape
- **WHEN** user navigates to a tape URL for a `skipped` tape
- **THEN** they SHALL see the tape title and "No submissions this round"
