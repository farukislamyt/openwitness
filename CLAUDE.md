# OpenWitness — Claude Instructions

Read `README.md` and `AGENTS.md` before making changes.

## Project Identity

OpenWitness is a Bengali-first anonymous public-interest reporting platform for Bangladesh.

Repository:

https://github.com/farukislamyt/openwitness

Maintainer:

Faruk Islam

---

## Technology

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase
- PostgreSQL
- Supabase Auth
- Vercel
- GitHub

---

## Non-Negotiable Architecture

### Public users

Public users are anonymous.

There is NO:

- signup
- public login
- public account
- public profile
- reporter identity

### Staff

Only staff authenticate.

Authentication:

```text
Supabase Auth
```

Authorization:

```text
admin_users
+
PostgreSQL RLS
```

Roles:

```text
admin
moderator
```

---

## Privacy

Reporter identity must never be stored.

Do not add:

```text
user_id
reporter_id
name
email
phone
address
ip_address
device_id
browser_fingerprint
gps_coordinates
tracking_id
```

Do not introduce tracking without explicit architectural approval.

---

## Language

The application is Bengali-first.

All public-facing UI should be Bengali.

Technical identifiers can remain English.

---

## Database

The production V1 migration is frozen:

```text
supabase/migrations/20260825192716_create_openwitness_v1.sql
```

NEVER modify, rename, or delete this migration.

Any database change requires a new migration.

Create one with:

```powershell
supabase migration new <migration_name>
```

Test with:

```powershell
supabase db push --dry-run
```

Only then deploy:

```powershell
supabase db push
```

---

## Database Baseline

Current production baseline:

```text
8 divisions
64 districts
16 categories
```

Verification:

```text
OPENWITNESS V1 DATABASE BASELINE: PASS
```

---

## Security

Preserve:

```text
RLS
FORCE RLS
GRANTS
REVOKES
foreign keys
indexes
security-definer protections
private schema
security-invoker public view
```

Never disable RLS to solve an application problem.

Never expose:

```text
admin_users
moderation_actions
database_metadata
pending incidents
rejected incidents
archived incidents
```

to anonymous users.

---

## Service Role

Never expose:

```text
SUPABASE_SERVICE_ROLE_KEY
```

to the browser.

Never use it in:

```text
NEXT_PUBLIC_*
```

Never commit it to GitHub.

---

## Incident Rules

Anonymous public submissions begin as:

```text
pending
```

with:

```text
verification_status = reported
published_at = null
```

Only approved incidents can be publicly displayed.

Public data should use:

```text
public.public_incidents
```

where appropriate.

---

## Location

OpenWitness supports Bangladesh's:

```text
8 divisions
64 districts
```

The UI must implement:

```text
Division
   ↓
District
```

Only districts belonging to the selected division may be selected.

---

## Moderation

Moderators can review incidents.

Admins have elevated permissions.

Do not give moderator-level users unrestricted admin capabilities.

Preserve moderation audit history.

---

## Implementation Style

Prefer:

- Server-side authorization
- Server components where appropriate
- Typed Supabase access
- Reusable components
- Simple architecture
- Accessible forms
- Semantic HTML
- Strong input validation

Avoid unnecessary dependencies and unnecessary client-side state.

---

## Validation

Never rely only on client-side validation.

Validate important fields server-side/database-side as well.

Relevant incident fields:

```text
title
description
category
division
district
incident_date
```

---

## Error Handling

Do not expose raw:

```text
SQL errors
database errors
stack traces
Supabase credentials
internal implementation details
```

to public users.

Public error messages should be Bengali-first and user-friendly.

---

## Testing

Before considering a feature complete:

```powershell
npm run lint
npm run build
```

must pass.

For database changes:

```powershell
supabase db push --dry-run
```

must be reviewed.

---

## Git

Use clear commit messages.

Examples:

```text
feat: add anonymous incident submission
fix: validate district selection
feat: add moderator dashboard
fix: protect admin route
docs: update documentation
```

Never commit:

```text
.env
.env.local
credentials
tokens
service-role keys
```

---

## Important

Do not silently change the architecture.

If a requested feature conflicts with:

- reporter anonymity
- RLS
- staff authorization
- frozen V1 database
- Bengali-first UI

preserve the existing architecture and explain the conflict before proceeding.

---

## Priority

When making implementation decisions, prioritize:

1. Privacy
2. Security
3. Database integrity
4. Correct authorization
5. Maintainability
6. Performance
7. Convenience

OpenWitness must remain anonymous, Bengali-first, secure, and migration-controlled.