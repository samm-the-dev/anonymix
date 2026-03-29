## MODIFIED Requirements

### Requirement: Tape lifecycle triggers
The `advance_next_tape` trigger SHALL only advance the next upcoming tape to `submitting` when no tape in the same session currently has `status = 'submitting'`. This prevents two tapes from being in submitting status simultaneously.

#### Scenario: Normal advancement
- **WHEN** a tape transitions to `results` and no other tape in the session is `submitting`
- **THEN** the next `upcoming` tape SHALL be advanced to `submitting`

#### Scenario: Guard prevents dual submitting
- **WHEN** a tape transitions to `results` but another tape in the session is already `submitting`
- **THEN** no tape SHALL be advanced

#### Scenario: Playlist ready advancement still works
- **WHEN** a tape transitions to `playlist_ready` and no other tape is `submitting`
- **THEN** the next `upcoming` tape SHALL be advanced to `submitting`
