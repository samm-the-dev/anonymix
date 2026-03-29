## MODIFIED Requirements

### Requirement: Upcoming tape display
Upcoming tapes SHALL appear as spines in the crate (browsable via tap). When an upcoming tape is selected, the tape card SHALL show the "Upcoming" status badge, the tape title and prompt, but no action buttons.

#### Scenario: Viewing an upcoming tape
- **WHEN** user taps an upcoming tape spine in the crate
- **THEN** the card SHALL show the prompt with an "Upcoming" badge and no action buttons

### Requirement: Comment deadline display
When the active tape is in `playlist_ready` status with a deadline set, the tape card SHALL display the deadline countdown (matching the submitting deadline pattern).

#### Scenario: Playlist ready with deadline
- **WHEN** a tape is in `playlist_ready` with a deadline 2 days away
- **THEN** the card SHALL show "Due in 2 days"
