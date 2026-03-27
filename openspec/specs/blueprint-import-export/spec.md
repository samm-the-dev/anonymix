## ADDED Requirements

### Requirement: Blueprint JSON format
Session blueprints SHALL be JSON files with extension `.anonymix.json` containing: `version` (1), `name`, `description`, `submitDays`, `commentDays`, and `tapes` array (each with `name` and `prompt`). No IDs or server state.

#### Scenario: Valid blueprint structure
- **WHEN** a blueprint is exported
- **THEN** the JSON SHALL contain version 1, session name, description, timing values, and tape array

### Requirement: Export from session card
The session card dots menu SHALL include an "Export" option. Clicking it SHALL fetch the session's tapes from Supabase and download a `.anonymix.json` file named after the session.

#### Scenario: Export session
- **WHEN** user clicks Export in the dots menu
- **THEN** a file named `session-name.anonymix.json` SHALL be downloaded containing the session's name, description, and all tapes

### Requirement: Import in create flow
The create session page SHALL have an "Import" button that opens a file picker for `.anonymix.json` files. After selection, a modal SHALL display the blueprint name and tape count with three options: "Add tapes" (append imported tapes), "Replace all" (overwrite everything), and a checkbox to "Overwrite session name, description & timing".

#### Scenario: Import with replace all
- **WHEN** user imports a blueprint and clicks "Replace all"
- **THEN** all existing tapes, session name, description, and timing SHALL be replaced with the blueprint values

#### Scenario: Import with add tapes only
- **WHEN** user imports a blueprint with the overwrite checkbox unchecked and clicks "Add tapes"
- **THEN** imported tapes SHALL be appended and session name/description/timing SHALL remain unchanged
