# OpenWitness — Agent Instructions

## Purpose

OpenWitness is an anonymous public-interest incident reporting platform.

The system prioritizes:

- Reporter privacy
- Secure anonymous submission
- Database integrity
- Row Level Security
- Moderated publication
- Auditability
- Minimal privileges
- Explicit database migrations

Agents working on this repository must preserve these principles.

---

## Current Stack

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- Supabase
- PostgreSQL
- Supabase CLI
- ESLint
- Git/GitHub

Docker is not required for the current development workflow.

---

## Important Files

```text
app/
  report/
    page.tsx

lib/
  supabase/
    client.ts

types/
  database.ts

supabase/
  migrations/
```

---

## Database Baseline

The original V1 database migration is:

```text
supabase/migrations/20260825192716_create_openwitness_v1.sql
```

This migration is **frozen**.

### Never modify the frozen migration.

If the database requires a change:

```text
Existing migration
        ↓
DO NOT EDIT
        ↓
Create new migration
        ↓
Test
        ↓
Apply
        ↓
Verify
```

Use:

```powershell
supabase migration new descriptive_name
```

---

## Existing Corrective Migrations

The current database includes:

```text
20260825200659_fix_public_categories_rls.sql
20260825202106_fix_incident_date_timezone.sql
```

These are already applied to the remote database.

Do not recreate or duplicate these fixes.

---

## Supabase Rules

Always treat Supabase RLS as part of the security architecture.

Do not solve a query failure by:

```text
- disabling RLS
- granting broad privileges
- granting anon access to private functions
- exposing pending records
- using service-role credentials in the browser
```

Instead:

1. Inspect the exact PostgreSQL error.
2. Identify the database role.
3. Inspect table privileges.
4. Inspect RLS policies.
5. Inspect relevant functions.
6. Inspect relevant triggers.
7. Make the smallest safe correction.
8. Use a new migration.
9. Verify the result.

---

## Anonymous Reporting

Anonymous users are allowed to submit incidents.

The reporter does not need:

- Account
- Name
- Email
- Phone number

The report submission flow currently performs an INSERT only:

```ts
const { error: insertError } = await supabase
  .from("incidents")
  .insert(insertPayload);
```

Do not change this to:

```ts
.insert(insertPayload)
.select(...)
```

unless the RLS model is deliberately changed and reviewed.

New incidents are pending and anonymous users are intentionally prevented from reading pending incidents.

---

## Incident Security Model

The expected flow is:

```text
Anonymous reporter
       │
       ▼
Incident INSERT
       │
       ▼
Pending
       │
       ▼
Moderation
       │
 ┌─────┴─────┐
 ▼           ▼
Approved    Rejected
 │
 ▼
Public
```

Never expose pending moderation data through public queries.

---

## Incident Date

OpenWitness uses the Bangladesh calendar for incident-date validation.

Timezone:

```text
Asia/Dhaka
```

The database is configured with UTC timezone.

Therefore, do not use database UTC `CURRENT_DATE` for Bangladesh-specific incident-date validation.

The current database validation uses:

```sql
(CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Dhaka')::date
```

An incident date later than the current Bangladesh calendar date must be rejected.

---

## Description Validation

The database constraint requires:

```text
20 <= trimmed description length <= 10000
```

The frontend also validates this before submission.

Do not remove the database constraint just because frontend validation is present.

Database validation remains authoritative.

---

## Categories

Public users may read active categories.

Authenticated administrators may read inactive categories.

Anonymous users must not be required to execute:

```text
private.is_admin()
```

or other privileged security functions.

The current categories RLS design intentionally separates:

```text
Public active-category access
```

from:

```text
Authenticated administrator access
```

---

## Database Functions

Security-sensitive functions may use:

```sql
SECURITY DEFINER
```

When modifying a security-definer function, preserve an explicit safe search path where appropriate.

The current incident date function uses:

```sql
SECURITY DEFINER
SET search_path TO ''
```

Do not casually remove these security properties.

---

## Generated Database Types

Database types are stored in:

```text
types/database.ts
```

Regenerate after schema changes:

```powershell
supabase gen types typescript --linked > types\database.ts
```

After generation, verify the file encoding if using PowerShell.

The generated file must be valid UTF-8 and must pass ESLint.

Run:

```powershell
npx tsc --noEmit
npm run lint
```

---

## Supabase Client

The browser client is:

```text
lib/supabase/client.ts
```

Use the generated `Database` type when appropriate.

Do not introduce an untyped Supabase client when the existing typed client can be used.

---

## Environment Variables

Never commit secrets.

Client-side environment variables may include only values intentionally safe for browser use, such as:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Never put these in client code:

```text
SUPABASE_SERVICE_ROLE_KEY
DATABASE_PASSWORD
private API keys
secret tokens
```

---

## Frontend Validation

Frontend validation should provide a good user experience.

It must not replace database validation.

Current report validation includes:

```text
Category required
Division required
District required
Incident date required
Incident date <= Bangladesh current date
Title required
Description required
Description >= 20 characters
Description <= 10,000 characters
```

---

## Error Handling

Do not hide Supabase errors during development.

Use explicit logging such as:

```ts
console.error(
  "[OpenWitness] Incident submission failed:",
  JSON.stringify(info, null, 2),
);
```

When debugging database errors, preserve:

```text
code
message
details
hint
```

Do not replace a useful database error with an unexplained generic error during development.

User-facing production messages may be more concise.

---

## Data Integrity

Do not bypass:

- PostgreSQL constraints
- PostgreSQL triggers
- Foreign keys
- RLS
- Database validation functions

If application code conflicts with database rules, determine whether the application is wrong before changing the database.

---

## Migration Workflow

For every database change:

### 1. Create migration

```powershell
supabase migration new descriptive_name
```

### 2. Write migration

Keep the migration:

- focused
- reversible where practical
- explicit
- security-conscious

### 3. Dry run

```powershell
supabase db push --dry-run
```

### 4. Apply

```powershell
supabase db push
```

### 5. Verify

```powershell
supabase migration list
```

Local and remote migration histories must remain synchronized.

---

## Application Verification

After code changes:

```powershell
npx tsc --noEmit
```

Then:

```powershell
npm run lint
```

Both must pass before committing.

For report-flow changes, also test the actual browser flow.

---

## Report Submission Testing

At minimum test:

### Valid report

```text
Active category
Valid division
Valid district
Current/past incident date
20+ character description
Valid title
```

Expected:

```text
Successful submission
```

### Future date

Expected:

```text
Incident date cannot be in the future
```

### Short description

Expected:

```text
Description must contain at least 20 characters
```

### Long description

Expected:

```text
Description cannot exceed 10,000 characters
```

---

## Code Style

Prefer:

- TypeScript
- explicit types
- small functions
- readable validation
- existing project conventions
- generated database types
- clear error handling

Avoid:

- unnecessary abstractions
- `any`
- duplicated database types
- broad refactors while fixing a focused issue
- unrelated dependency changes

---

## Security Review Before Changes

Before modifying any database-backed feature, ask:

```text
Who can execute this?
Who can read this?
Who can insert this?
Who can update this?
Who can delete this?
What happens if the user is anonymous?
What happens if the user is authenticated?
What happens if the user manipulates the browser?
What happens if the client bypasses validation?
```

The answer must be enforced at the database level where appropriate.

---

## Public vs Internal Data

Public users should only see intentionally public data.

Do not expose:

- pending reports
- rejected reports
- moderation notes
- internal audit records
- administrative information
- private reporter information

unless the database architecture explicitly defines that information as public.

---

## Git Rules

Before changing files:

```powershell
git status
```

After changes:

```powershell
npx tsc --noEmit
npm run lint
git diff
```

Before commit:

```powershell
git status
```

Use focused commits.

Examples:

```text
feat: add moderation dashboard
fix: correct incident date validation
fix: secure categories RLS
refactor: simplify report form
docs: update project documentation
```

Do not commit:

```text
.env
.env.local
secrets
credentials
service-role keys
database passwords
```

---

## Current Verified Commit

The current report submission and security corrections are committed as:

```text
5ddb597
```

Commit:

```text
fix: secure report submission and incident validation
```

The main branch is expected to remain clean after completed work.

---

## Do Not Guess

If an error originates from PostgreSQL or Supabase:

```text
Do not guess.
```

Inspect:

```text
error.code
error.message
error.details
error.hint
```

Then inspect the actual database object involved.

Examples:

```sql
pg_get_functiondef(...)
```

```sql
pg_get_constraintdef(...)
```

```text
information_schema.triggers
```

```text
pg_policies
```

Use evidence from the actual database before changing security-sensitive code.

---

## Scope Discipline

When fixing a bug:

1. Reproduce it.
2. Identify the root cause.
3. Fix only the required layer.
4. Preserve existing security controls.
5. Run tests.
6. Verify the real user flow.
7. Commit the smallest coherent change.

Do not perform unrelated refactors during a security or data-integrity fix.

---

## Priority Order

When making engineering decisions, prioritize:

```text
1. Security
2. Data integrity
3. Privacy
4. Correctness
5. Maintainability
6. User experience
7. Performance
```

Do not sacrifice a higher-priority property merely to simplify implementation.

---

## Future Development

The next major area after anonymous reporting is the moderation workflow.

Expected future architecture:

```text
Anonymous reporting
        ↓
Pending incidents
        ↓
Authenticated staff/admin
        ↓
Review
        ↓
Approve / Reject
        ↓
Public approved incidents
```

Any moderation implementation must preserve the existing anonymous-reporting security model.