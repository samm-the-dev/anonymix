## MODIFIED Requirements

### Requirement: Submit song
Clicking Submit SHALL insert a record into the `submissions` table with `tape_id`, `player_id`, `song_name`, and `artist_name`. The unique constraint `(tape_id, player_id)` SHALL enforce one submission per player per tape.

The database SHALL enforce via RLS that:
1. The `tape_id` references a tape with `status = 'submitting'`
2. The submitting player is a member of the tape's session (via `is_session_member`)
3. The `player_id` matches the authenticated user

If the RLS policy rejects the insert, the frontend SHALL display a toast: "This tape is no longer accepting submissions" and refresh the page data.

#### Scenario: Successful submission
- **WHEN** user selects a song and clicks Submit while the tape status is `submitting`
- **THEN** a submission record SHALL be created and the search overlay SHALL close, showing the submission on the tape view

#### Scenario: Submission rejected — tape no longer accepting
- **WHEN** user clicks Submit but the tape has already advanced past `submitting`
- **THEN** the insert SHALL be rejected by RLS and the frontend SHALL display an error toast and refresh the tape data

#### Scenario: Submission rejected — not a session member
- **WHEN** a player who is not in the session's `session_players` attempts to insert a submission
- **THEN** the insert SHALL be rejected by RLS

### Requirement: Change existing submission
If the user has already submitted, the tape view SHALL show their current pick with a "Change" link. Clicking Change SHALL re-open the search overlay. Submitting again SHALL update the existing record. The update SHALL only succeed while the tape status is `submitting`.

#### Scenario: Change submission
- **WHEN** user clicks Change and selects a new song while the tape status is `submitting`
- **THEN** the existing submission record SHALL be updated with the new song name and artist

#### Scenario: Change rejected — tape no longer accepting
- **WHEN** user attempts to update their submission but the tape has advanced past `submitting`
- **THEN** the update SHALL be rejected by RLS and the frontend SHALL display an error toast
