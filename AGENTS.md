# OpenWitness — AI Agent Instructions

## Project

OpenWitness is a Bengali-first anonymous public-interest reporting platform for Bangladesh.

Repository:

https://github.com/farukislamyt/openwitness

Developer / Maintainer:

Faruk Islam

---

# 1. Read Before Working

Before modifying the project, read:

```text
README.md
AGENTS.md
CLAUDE.md
```

The database migration history must also be inspected before making database-related changes.

---

# 2. Core Architecture

OpenWitness has:

```text
Next.js
React
TypeScript
Tailwind CSS
Supabase
PostgreSQL
Supabase Auth
Vercel
GitHub
```

Public users are anonymous.

Staff users authenticate through Supabase Auth.

---

# 3. Critical Privacy Rule

OpenWitness does NOT have public user accounts.

Never introduce:

```text
signup
public login
public account
public profile
reporter account
```

without explicit architectural approval.

---

# 4. Reporter Identity Rule

Reporter identity must never be stored.

Do NOT add fields such as:

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

Do not introduce tracking merely to solve spam or abuse.

---

# 5. Language Rule

The public application is Bengali-first.

User-facing text should be written in Bengali.

Technical identifiers may remain English.

Examples:

```text
Database:
incidents
districts
categories

UI:
ঘটনা
জেলা
শ্রেণি
```

Do not randomly introduce English UI labels.

---

# 6. Database Rule

The production V1 database is FROZEN.

Frozen migration:

```text
supabase/migrations/20260825192716_create_openwitness_v1.sql
```

NEVER:

```text
edit it
rename it
delete it
rewrite it
```

If a database change is required, create a NEW migration.

Example:

```powershell
supabase migration new add_feature_name
```

Then:

```powershell
supabase db push --dry-run
```

Only after review:

```powershell
supabase db push
```

---

# 7. Database Security

Never disable RLS.

Never bypass database security simply to make a feature easier.

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
security-invoker views
```

Do not expose private moderation tables to anonymous users.

---

# 8. Authentication

Public users:

```text
No authentication
```

Staff:

```text
Supabase Auth
```

Staff authorization comes from:

```text
public.admin_users
```

Roles:

```text
admin
moderator
```

Do not implement authorization using frontend state alone.

Authorization must be enforced server-side and by PostgreSQL RLS.

---

# 9. Service Role Key

Never put:

```text
SUPABASE_SERVICE_ROLE_KEY
```

inside:

```text
NEXT_PUBLIC_*
```

Never expose it to browser code.

Never commit it to GitHub.

Use it only in trusted server-side code when absolutely necessary.

---

# 10. Public Incident Rules

Public users can submit anonymous incidents.

A new public incident must remain:

```text
status = pending
verification_status = reported
published_at = null
```

Public users must never be able to create an already-approved incident.

---

# 11. Publication Rules

Only approved incidents may be public.

Expected publication state:

```text
status = approved
published_at IS NOT NULL
```

Never expose pending, rejected, or archived incidents through public pages.

Use the public-safe view:

```text
public.public_incidents
```

where appropriate.

---

# 12. Location Rules

OpenWitness is Bangladesh-only.

The database contains:

```text
8 divisions
64 districts
```

The UI must use cascading selection:

```text
Division
   ↓
District
```

A district must belong to the selected division.

Never bypass the database relationship.

---

# 13. Moderation

Moderators can review and manage incidents.

Admins have elevated permissions including staff and configuration management.

Never give moderators unrestricted admin permissions.

Moderation changes must preserve the audit trail.

---

# 14. UI Rules

Build reusable components.

Prefer:

```text
server components
server-side authorization
typed data access
accessible forms
semantic HTML
```

Avoid unnecessary client-side state.

Do not put secrets in client components.

---

# 15. Error Handling

Never expose:

```text
database errors
SQL errors
stack traces
Supabase secrets
internal implementation details
```

to public users.

Public errors should be understandable and Bengali-first.

Detailed errors may be logged securely server-side.

---

# 16. Validation

Validate input both:

```text
client-side
+
server/database-side
```

Never rely only on frontend validation.

Always validate:

```text
title
description
category
division
district
incident_date
```

---

# 17. Code Quality

Prefer simple, maintainable code.

Avoid unnecessary dependencies.

Before completing significant work:

```powershell
npm run lint
npm run build
```

Both should pass.

---

# 18. Database Changes

Before database deployment:

```powershell
supabase db push --dry-run
```

Review the migration.

Never directly modify production schema through the dashboard when the change should be represented by a migration.

---

# 19. Git

Use meaningful commits.

Examples:

```text
feat: add anonymous report form
fix: validate district selection
feat: add moderator dashboard
fix: protect admin route
docs: update README
```

Do not commit:

```text
.env
.env.local
credentials
tokens
service-role keys
```

---

# 20. AI Agent Safety

Before implementing a feature, check whether it affects:

```text
privacy
authentication
authorization
RLS
database schema
public exposure
reporter anonymity
```

If it does, preserve the existing security architecture.

Do not make architectural changes silently.

---

# 21. Frozen Database Principle

The V1 database is the production baseline.

Treat it as immutable.

Future evolution must be:

```text
V1
 ↓
new migration
 ↓
V1.x / V2
```

Never rewrite history.

---

# 22. Final Rule

When uncertain, prefer:

```text
privacy
security
database integrity
least privilege
maintainability
```

over convenience.

OpenWitness must remain anonymous, Bengali-first, secure, and migration-controlled.