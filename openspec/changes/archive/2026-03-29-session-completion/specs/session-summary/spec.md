## ADDED Requirements

### Requirement: Session summary stats
When a session is ended, the session view SHALL display a summary section showing: tapes completed (excluding skipped), total songs shared, total comments left, most-commented song(s), and most active commenter(s).

#### Scenario: Completed session with stats
- **WHEN** user views a session where `ended = true` with 3 tapes (2 completed, 1 skipped), 6 songs, and 15 comments
- **THEN** the summary SHALL show "2 tapes completed", "6 songs shared", "15 comments left", the most-commented song(s), and the most active commenter(s)

#### Scenario: Tied most-commented songs
- **WHEN** two songs each have 4 comments (the highest count)
- **THEN** both songs SHALL appear in the most-commented list

#### Scenario: Tied most active commenters
- **WHEN** two players each left 6 comments (the highest count)
- **THEN** both players SHALL appear in the most active list

### Requirement: Summary is collapsible
The summary section SHALL be collapsible so it doesn't block tape browsing. It SHALL default to expanded on first visit to a completed session.

#### Scenario: User collapses summary
- **WHEN** user collapses the summary section
- **THEN** only the tape crate SHALL be visible below the context bar
