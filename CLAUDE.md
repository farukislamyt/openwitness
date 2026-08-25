# OpenWitness — Claude Instructions

## Project

OpenWitness is an anonymous public-interest incident reporting platform.

Core priorities:

1. Security
2. Data integrity
3. Privacy
4. Correctness
5. Maintainability
6. User experience

---

## Stack

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- Supabase
- PostgreSQL
- Supabase CLI
- ESLint
- Git/GitHub

Docker is not required.

---

## Critical Database Rule

The V1 database migration is frozen:

```text
supabase/migrations/20260825192716_create_openwitness_v1.sql
```

**Never modify an already-applied migration.**

For every database change:

```powershell
supabase migration new descriptive_name
supabase db push --dry-run
supabase db push
supabase migration list
```

Always use a new migration for changes.

---

## Current Migrations

```text
20260825192716_create_openwitness_v1.sql
20260825200659_fix_public_categories_rls.sql
20260825202106_fix_incident_date_timezone.sql
```

All three are currently applied to the remote database.

---

## Anonymous Reporting

The report page is:

```text
app/report/page.tsx
```

Anonymous users can submit incidents without:

- account
- name
- email
- phone

The current submission intentionally uses INSERT only:

```ts
const { error: insertError } = await supabase
  .from("incidents")
  .insert(insertPayload);
```

Do not add `.select()` to the anonymous submission unless the RLS architecture is deliberately changed and reviewed.

Pending incidents must remain inaccessible to anonymous users.

---

## Incident Date

OpenWitness uses the Bangladesh calendar:

```text
Asia/Dhaka
```

The database itself uses UTC.

Never use UTC `CURRENT_DATE` for Bangladesh-specific incident-date validation.

The current database validation uses:

```sql
(CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Dhaka')::date
```

Future incident dates must be rejected.

---

## Description

The database requires:

```text
20–10,000 characters
```

after trimming whitespace.

The frontend also validates:

```text
minimum = 20
maximum = 10000
```

Never remove the database constraint merely because frontend validation exists.

---

## RLS

Treat RLS as a core security boundary.

Never fix a query problem by:

- disabling RLS
- granting excessive privileges
- exposing private functions to `anon`
- allowing anonymous users to read pending incidents
- putting a service-role key in browser code

When an RLS/database error occurs, inspect the actual:

```text
code
message
details
hint
policy
privileges
function
trigger
constraint
```

Do not guess.

---

## Categories

Public users may read active categories.

Authenticated administrators may read inactive categories.

Anonymous users must not need to execute:

```text
private.is_admin()
```

The corrective categories migration already separates public and administrator access.

Do not duplicate or replace that migration without a demonstrated reason.

---

## Supabase Client

Browser client:

```text
lib/supabase/client.ts
```

Generated database types:

```text
types/database.ts
```

Regenerate types after database schema changes:

```powershell
supabase gen types typescript --linked > types\database.ts
```

Then run:

```powershell
npx tsc --noEmit
npm run lint
```

---

## Security Functions

Security-sensitive PostgreSQL functions may use:

```sql
SECURITY DEFINER
```

Preserve an explicit safe search path where currently used.

For example:

```sql
SECURITY DEFINER
SET search_path TO ''
```

Do not weaken security-definer functions to solve application errors.

---

## Frontend Rules

Use the generated Supabase `Database` type.

Prefer explicit types over `any`.

Validate user input before submission.

Keep database validation authoritative.

Avoid unrelated refactoring when fixing a focused bug.

---

## Error Debugging

For Supabase errors, inspect:

```ts
error.code
error.message
error.details
error.hint
```

A useful development log is:

```ts
console.error(
  "[OpenWitness] Database operation failed:",
  JSON.stringify(
    {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    },
    null,
    2,
  ),
);
```

Do not hide the real database error while debugging.

---

## Verification

After code changes:

```powershell
npx tsc --noEmit
npm run lint
```

After database changes:

```powershell
supabase db push --dry-run
supabase db push
supabase migration list
```

For report-flow changes, test the actual browser submission.

---

## Report Testing

Test all of the following:

### Valid

```text
Active category
Valid division
Valid district
Current/past Bangladesh date
20–10,000 character description
Valid title
```

### Invalid future date

Must be rejected.

### Description under 20 characters

Must be rejected.

### Description over 10,000 characters

Must be rejected.

### Anonymous access

Must work without login.

### Pending privacy

Anonymous users must not be able to read pending incidents.

---

## Environment Variables

Never commit secrets.

Allowed client configuration may include:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Never expose:

```text
SUPABASE_SERVICE_ROLE_KEY
database passwords
private API keys
secret tokens
```

---

## Git

Use focused conventional commits.

Examples:

```text
feat: add moderation dashboard
fix: correct incident validation
fix: secure categories RLS
refactor: simplify report form
docs: update agent instructions
```

Before committing:

```powershell
git status
git diff
npx tsc --noEmit
npm run lint
```

After pushing:

```powershell
git status
```

The expected final state is:

```text
nothing to commit, working tree clean
```

---

## Current Verified State

The anonymous reporting flow is working.

Verified:

```text
✓ Supabase linked
✓ V1 database applied
✓ Corrective migrations applied
✓ Migration history synchronized
✓ Categories loading
✓ Divisions loading
✓ Districts loading
✓ Anonymous incident submission
✓ Bangladesh timezone-aware date validation
✓ Description length validation
✓ RLS protection
✓ TypeScript
✓ ESLint
✓ Git push
```

Current report/security commit:

```text
5ddb597
```

Commit:

```text
fix: secure report submission and incident validation
```

---

## Future Work

The next major feature is moderation.

Expected flow:

```text
Anonymous report
       ↓
Pending
       ↓
Authenticated staff/admin
       ↓
Review
       ↓
Approve / Reject
       ↓
Approved → Public
Rejected → Internal
```

Any future moderation implementation must preserve:

- anonymous reporter privacy
- pending-incident privacy
- RLS
- database validation
- auditability
- least-privilege access