## MODIFIED Requirements

### Requirement: Session Home data source
The SessionHomePage SHALL consume data from the `useSessionList` hook (Supabase) instead of the mock data module. The page SHALL display a loading state while data is being fetched and an error state if the query fails.

#### Scenario: Loading state
- **WHEN** the page mounts and data is being fetched
- **THEN** a loading indicator SHALL be displayed

#### Scenario: Data loaded
- **WHEN** the Supabase query returns sessions
- **THEN** the page SHALL render session cards identical to the previous mock data rendering

#### Scenario: Query error
- **WHEN** the Supabase query fails
- **THEN** an error message SHALL be displayed to the user
