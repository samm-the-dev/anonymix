## ADDED Requirements

### Requirement: Single-page create session flow
Session creation SHALL be a single scrollable page with tape crate editor at top, session details pinned to bottom, and a "Create Session" button. Celebration with invite link SHALL be a separate step shown after creation.

Reference: [03.1-create-tape spec](_bmad-output/C-UX-Scenarios/03-the-hosts-new-session/03.1-create-tape/03.1-create-tape.md), [create-tape.html prototype](_bmad-output/D-Prototypes/03-the-hosts-new-session-prototype/create-tape.html)

#### Scenario: Create session with one tape
- **WHEN** user enters a tape name, session name, and clicks Create
- **THEN** a session SHALL be created in Supabase with the user as admin and member, and one tape in `submitting` status with the configured deadline

### Requirement: Crate-flip tape editor
The tape editor SHALL use crate-flip navigation: active tape card in center, past tapes as receding spines above, future tapes as receding spines below. Spines SHALL be clickable to navigate. Arrow keys SHALL navigate between tapes when not focused on an input.

#### Scenario: Add another tape
- **WHEN** user clicks "Add another tape"
- **THEN** a new blank tape SHALL be appended and the crate SHALL navigate to it with the name input auto-focused

#### Scenario: Remove tape
- **WHEN** user clicks the trash icon on a tape (with more than one tape)
- **THEN** the tape SHALL be removed and the crate SHALL adjust

### Requirement: Session details (bottom panel)
The bottom panel SHALL contain: session name input (required), description input (optional), timing steppers (submit window and comment window with +/- buttons, min 1 day, max 14 days, defaults 2 and 5), and the Create Session button.

#### Scenario: Timing steppers
- **WHEN** user clicks + on submit window
- **THEN** the submit days SHALL increment by 1, up to 14

### Requirement: Celebration with invite link
After session creation, the page SHALL show a celebration screen with party emoji, "Your session is live!" heading, session name, tape count, invite link with copy button, share button (native share sheet or clipboard fallback), and "Go to session" button.

#### Scenario: Copy invite link
- **WHEN** user clicks Copy on the invite link
- **THEN** the full join URL SHALL be copied to clipboard

### Requirement: Blueprint import
The create page SHALL have an "Import" button that opens a file picker for `.anonymix.json` files. After picking, a modal SHALL show the blueprint name and tape count with options: "Add tapes" (additive), "Replace all" (overwrite), and a checkbox for "Overwrite session name, description & timing".

#### Scenario: Additive import
- **WHEN** user imports a blueprint and clicks "Add tapes"
- **THEN** the imported tapes SHALL be appended to existing tapes without replacing them

### Requirement: Autofill disabled on create fields
All text inputs in the create flow SHALL have `autoComplete="off"`, `data-lpignore="true"`, and `data-form-type="other"` to prevent browser and password manager autofill.

#### Scenario: No autofill on tape name
- **WHEN** user focuses the tape name input
- **THEN** browser autofill and password manager popups SHALL NOT appear
