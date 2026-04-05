## Why

RLS policies and database triggers are critical to data integrity but can only be tested against a real Supabase instance. Currently there's no automated way to verify these — manual SQL in the dashboard is the only option. As the policy surface grows (submission validation, member management, tape lifecycle), we need integration tests that run against a seeded preview DB to catch regressions.

## What Changes

- Set up an integration test suite (Vitest or Playwright) that runs against a Supabase preview branch
- Seed a dedicated test session with known state (tapes in various statuses, multiple players)
- Test RLS policies: insert/update/delete with correct and incorrect roles, tape statuses, membership
- Test trigger behavior: tape advancement, deadline setting, dual-submit guards
- Integrate with CI (run against preview DB on PRs that include migrations)

## Non-goals

- Mocking Supabase — tests must hit a real database
- Testing UI rendering — these are data-layer tests
- Running against prod

## Capabilities

### New Capabilities

- `integration-test-harness`: Test runner setup, Supabase client config, seed helpers, CI integration

### Modified Capabilities

_None_

## Impact

- **New devDependency**: Possibly `@supabase/supabase-js` test helpers or direct REST calls
- **CI**: New test step gated on migration changes
- **Seed data**: Dedicated test fixtures separate from dev seed
