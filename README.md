# OpenWitness

OpenWitness is an anonymous public-interest incident reporting platform designed to help people report incidents without creating an account or providing personal contact information.

The project is being built with a strong focus on:

- Anonymous reporting
- Public-interest incidents
- Moderated publication
- Data integrity
- Row Level Security (RLS)
- Privacy
- Auditability
- Secure database design

---

## Project Status

**Current stage:** V1 foundation + anonymous reporting flow

The current implementation includes:

- Next.js application
- TypeScript
- Tailwind CSS
- Supabase
- PostgreSQL database
- Supabase migrations
- Generated Supabase TypeScript database types
- Anonymous incident reporting
- Public reference data
- Database-level validation
- Row Level Security
- Corrective security migrations
- Bangladesh timezone-aware incident-date validation

The anonymous report submission flow is currently working end-to-end.

---

## Technology Stack

### Frontend

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- ESLint

### Backend / Database

- Supabase
- PostgreSQL
- Supabase Auth infrastructure
- Row Level Security (RLS)
- PostgreSQL functions and triggers
- PostgreSQL constraints

### Development

- npm
- Supabase CLI
- Git
- GitHub

Docker is **not required** for the current development workflow.

---

## Repository

GitHub:

https://github.com/farukislamyt/openwitness

---

## Project Structure

```text
openwitness/
├── app/
│   ├── report/
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
│
├── lib/
│   └── supabase/
│       └── client.ts
│
├── types/
│   └── database.ts
│
├── supabase/
│   ├── migrations/
│   │   ├── 20260825192716_create_openwitness_v1.sql
│   │   ├── 20260825200659_fix_public_categories_rls.sql
│   │   └── 20260825202106_fix_incident_date_timezone.sql
│   └── config.toml
│
├── public/
│
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── package.json
├── package-lock.json
├── next.config.ts
├── tsconfig.json
└── eslint.config.mjs
```

---

## Database

The initial database schema is defined by the V1 baseline migration:

```text
supabase/migrations/20260825192716_create_openwitness_v1.sql
```

The V1 baseline is considered **frozen**.

Do not modify the original V1 migration after it has been applied to the remote database.

Any future database changes must be created as new migrations.

---

## Current Database Components

The current database includes the following public tables:

```text
admin_users
categories
database_metadata
districts
divisions
incident_reports
incidents
moderation_actions
public_incidents
```

The database also contains security functions, triggers, constraints, and RLS policies supporting the reporting and moderation architecture.

---

## Anonymous Reporting

OpenWitness currently supports anonymous incident submission.

A reporter does not need:

- An account
- A name
- An email address
- A phone number

The current report flow collects public-interest incident information such as:

- Incident category
- Division
- District
- Incident date
- Incident title
- Incident description

A new incident is created as a pending record and is intended to go through moderation before becoming publicly visible.

---

## Report Submission Security Model

The current anonymous submission flow is intentionally **INSERT-only**.

The frontend does not perform:

```ts
.insert(...).select(...)
```

after inserting an incident.

Instead it performs:

```ts
const { error: insertError } = await supabase
  .from("incidents")
  .insert(insertPayload);
```

This is intentional.

New incidents are pending and anonymous users are not allowed to read pending incidents through the current RLS policies.

The application generates a public reference ID before insertion and displays that reference after a successful submission.

---

## Incident Validation

Incident validation is enforced at both the application and database levels.

### Incident date

An incident date cannot be in the future.

The application uses the Bangladesh timezone:

```text
Asia/Dhaka
```

The database validation also uses:

```sql
(CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Dhaka')::date
```

This is important because the Supabase/PostgreSQL database timezone is UTC.

The database must not rely on UTC `CURRENT_DATE` for Bangladesh calendar-date validation.

---

## Description Validation

The database currently requires:

```text
Minimum: 20 characters
Maximum: 10,000 characters
```

The application validates the same limits before submission.

The database remains the authoritative enforcement layer.

---

## Categories RLS

The corrective migration:

```text
20260825200659_fix_public_categories_rls.sql
```

fixes anonymous access to categories.

Public users can read active categories.

Authenticated administrators can read inactive categories.

Anonymous users do not need to execute privileged security functions such as:

```text
private.is_admin()
```

The public category policy is intentionally separated from the administrator policy.

---

## Incident RLS

The current incident security model allows anonymous/public users to submit incidents while restricting access to pending incidents.

The important principle is:

```text
Public user
    │
    ├── Read public/approved content
    │
    └── Submit new incident
             │
             ▼
          pending
             │
             ▼
        moderation
             │
        ┌────┴────┐
        ▼         ▼
     approved   rejected
        │
        ▼
     public
```

Pending incident records must not be exposed to anonymous users.

---

## Supabase Client

The browser Supabase client is located at:

```text
lib/supabase/client.ts
```

Generated database types are located at:

```text
types/database.ts
```

The generated database types should be regenerated whenever the remote database schema changes.

Use:

```powershell
supabase gen types typescript --linked > types\database.ts
```

If PowerShell creates the generated file with an incorrect encoding, convert it back to UTF-8 before running ESLint.

---

## Environment Variables

The application requires the Supabase project URL and public client key.

Create:

```text
.env.local
```

with the appropriate project values.

Example:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Do not commit `.env.local`.

Never expose:

- Supabase service-role keys
- Database passwords
- Private API keys
- Other privileged credentials

in client-side code or Git.

---

## Supabase CLI

The project uses the Supabase CLI.

Check the installed version:

```powershell
supabase --version
```

The project is already linked to the remote Supabase project.

Check migration synchronization with:

```powershell
supabase migration list
```

---

## Database Migrations

Create a new migration with:

```powershell
supabase migration new migration_name
```

Preview pending migrations:

```powershell
supabase db push --dry-run
```

Apply migrations:

```powershell
supabase db push
```

Do not edit an already-applied migration to fix production database state.

Instead:

```text
Existing migration
        ↓
Keep unchanged
        ↓
Create corrective migration
        ↓
Test
        ↓
Push
```

---

## Current Migrations

### V1 baseline

```text
20260825192716_create_openwitness_v1.sql
```

Initial OpenWitness database schema.

Status:

```text
Applied
Frozen
```

### Categories RLS correction

```text
20260825200659_fix_public_categories_rls.sql
```

Fixes anonymous category access without exposing privileged security functions.

Status:

```text
Applied
```

### Incident date timezone correction

```text
20260825202106_fix_incident_date_timezone.sql
```

Changes incident-date validation from database-UTC `CURRENT_DATE` to the Bangladesh calendar date.

Status:

```text
Applied
```

---

## Development Commands

Install dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

Run TypeScript validation:

```powershell
npx tsc --noEmit
```

Run ESLint:

```powershell
npm run lint
```

---

## Recommended Development Workflow

Before making changes:

```powershell
git status
```

After application changes:

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

Before committing:

```powershell
git status
git diff
```

Then:

```powershell
git add .
git commit -m "type: description"
git push
```

Finally verify:

```powershell
git status
```

Expected:

```text
nothing to commit, working tree clean
```

---

## Git Commit Convention

Use conventional commit messages.

Examples:

```text
feat: add moderation dashboard
fix: correct incident validation
fix: secure categories RLS
refactor: simplify report form
docs: update project documentation
chore: update dependencies
```

Keep commits focused and logically grouped.

---

## Security Principles

OpenWitness is a public-interest reporting system. Security and privacy are core requirements.

### Never

- Expose service-role credentials
- Disable RLS to solve application problems
- Grant anonymous users unnecessary privileges
- Allow anonymous users to read pending reports
- Bypass database validation
- Remove security triggers merely to make inserts work
- Modify the frozen V1 migration
- Commit secrets
- Trust client-side validation as the only protection

### Prefer

- Database-level constraints
- Database-level triggers
- RLS
- Security-definer functions where appropriate
- Explicit timezone handling
- Minimal public privileges
- Explicit migrations
- Generated database types
- Clear audit trails

---

## RLS Philosophy

RLS is part of the application architecture, not an optional database feature.

When an application query fails:

1. Determine the PostgreSQL error.
2. Identify the affected role.
3. Inspect table privileges.
4. Inspect RLS policies.
5. Inspect security functions.
6. Fix the smallest necessary layer.
7. Never broadly disable RLS as a shortcut.

---

## Moderation Model

The intended OpenWitness workflow is:

```text
Anonymous report
      │
      ▼
Pending incident
      │
      ▼
Moderation
      │
 ┌────┴────┐
 ▼         ▼
Approve   Reject
 │
 ▼
Public incident
```

Moderation should remain separate from anonymous reporting.

The reporter should not need an account to submit a report.

Staff/admin access should be protected through authenticated roles and database authorization.

---

## Public Data

The public-facing system should expose only content that is intended for publication.

Pending, rejected, moderation, administrative, audit, and other internal information must not be exposed through public queries.

Public views/tables should be used where appropriate to separate public information from internal records.

---

## Timezone Policy

OpenWitness is Bangladesh-focused.

For calendar-date business rules related to incidents, use:

```text
Asia/Dhaka
```

Do not assume that the database's UTC timezone represents Bangladesh's current calendar date.

For example:

```sql
(CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Dhaka')::date
```

should be preferred for Bangladesh calendar-date comparisons.

---

## Testing Checklist

Before considering a report submission change complete, test:

### Valid submission

- Active category
- Valid division
- Valid district
- Valid incident date
- Description of at least 20 characters
- Valid title

Expected:

```text
Report successfully submitted
```

### Future date

Try a date after the current Bangladesh date.

Expected:

```text
Incident date cannot be in the future
```

### Short description

Use fewer than 20 characters.

Expected:

```text
Description must contain at least 20 characters
```

### Long description

Use more than 10,000 characters.

Expected:

```text
Description cannot exceed 10,000 characters
```

### Anonymous access

Confirm that the reporter does not need:

- Login
- Email
- Phone
- Account

### Pending incident privacy

Confirm that an anonymous user cannot query pending incident records.

---

## Current Verified State

The current V1 foundation has been verified with:

```text
✓ Supabase linked
✓ Database migration applied
✓ Corrective migrations applied
✓ Migration history synchronized
✓ Supabase TypeScript types generated
✓ Supabase browser client configured
✓ Categories loading
✓ Divisions loading
✓ Districts loading
✓ Anonymous report submission working
✓ Bangladesh incident-date validation working
✓ Description length validation working
✓ RLS preserved
✓ TypeScript passing
✓ ESLint passing
✓ Git working tree clean
```

---

## Development Rules

Before changing database behavior:

1. Inspect the existing schema.
2. Inspect existing RLS policies.
3. Inspect relevant functions/triggers.
4. Determine the actual PostgreSQL error.
5. Do not guess.
6. Create a new migration.
7. Test with `supabase db push --dry-run`.
8. Apply the migration.
9. Regenerate database types if schema changes.
10. Run TypeScript and ESLint checks.

Before changing application behavior:

1. Understand the existing data model.
2. Use the generated `Database` types.
3. Preserve RLS assumptions.
4. Avoid unnecessary client-side database privileges.
5. Validate user input.
6. Keep database validation authoritative.
7. Test the actual user flow.

---

## Current Commit

The current report-flow/security corrections were committed as:

```text
5ddb597
```

Commit message:

```text
fix: secure report submission and incident validation
```

The branch is:

```text
main
```

and the repository is expected to remain synchronized with GitHub.

---

## License

License information will be added when the project's licensing decision is finalized.

---

## Project Goal

OpenWitness aims to provide a technically robust platform for documenting public-interest incidents while protecting reporters and maintaining a clear separation between:

```text
Reporting
    ↓
Validation
    ↓
Moderation
    ↓
Publication
```

The system should prioritize accuracy, privacy, accountability, and secure handling of public-interest information.