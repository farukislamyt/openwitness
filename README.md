# OpenWitness

> বাংলাদেশের জন্য নির্মিত একটি anonymous public-interest reporting platform।

OpenWitness একটি বাংলা-ভিত্তিক public-interest reporting web application, যেখানে বাংলাদেশের যেকোনো ব্যক্তি কোনো account, login বা personal identity প্রদান না করেই জনস্বার্থ সংশ্লিষ্ট কোনো ঘটনা রিপোর্ট করতে পারবেন।

প্রতিটি রিপোর্ট moderation-এর মধ্য দিয়ে যাবে। অনুমোদিত রিপোর্টগুলোই public platform-এ প্রকাশিত হবে।

---

## Project Status

**Status:** Active Development

**Database:** Production Ready / V1 Frozen

**Database Version:** `1.0.0`

**Schema Version:** `V1`

**Primary Language:** বাংলা

**Country:** বাংলাদেশ

**Public Authentication:** নেই

**Staff Authentication:** Supabase Auth

**Public Reporter Identity:** সংরক্ষণ করা হয় না

---

## Project Information

| Item | Value |
|---|---|
| Project | OpenWitness |
| Version | 1.0.0 |
| Developer / Maintainer | Faruk Islam |
| GitHub | https://github.com/farukislamyt/openwitness |
| Repository | `farukislamyt/openwitness` |
| Application | Next.js |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth |
| Primary Language | বাংলা |
| Country | বাংলাদেশ |
| Database Status | Frozen V1 |

---

# 1. Vision

OpenWitness-এর উদ্দেশ্য হলো বাংলাদেশের মানুষের জন্য একটি সহজ, নিরাপদ এবং anonymous public-interest reporting platform তৈরি করা।

একজন সাধারণ ব্যবহারকারী:

- কোনো account তৈরি করবে না
- login করবে না
- নিজের নাম দেবে না
- email দেবে না
- phone number দেবে না
- profile তৈরি করবে না

বরং সরাসরি একটি public-interest incident submit করতে পারবে।

রিপোর্ট moderation-এর পরে যাচাই ও অনুমোদিত হলে public platform-এ প্রকাশিত হবে।

---

# 2. Core Principles

OpenWitness-এর architecture নিচের principles অনুসরণ করে:

1. Anonymous reporting
2. No public user accounts
3. No public login
4. Privacy by design
5. Moderation before publication
6. Bangladesh-only geographic structure
7. Bangla-first user interface
8. Database-enforced security
9. Row Level Security (RLS)
10. Least-privilege access
11. Auditable moderation
12. Migration-based database management
13. Frozen production database baseline
14. GitHub-first source control

---

# 3. Public User Model

OpenWitness-এর public users-এর কোনো account থাকবে না।

### Public users cannot

- Sign up
- Sign in
- Create an account
- Create a profile
- View another user's identity
- Access moderation data
- Access admin data
- Access pending incidents
- Access rejected incidents
- Access archived incidents

### Public users can

- View approved incidents
- Browse categories
- Browse divisions
- Browse districts
- Submit anonymous incidents
- Flag/report an approved incident

---

# 4. Reporter Privacy

OpenWitness-এর database-এ reporter identity intentionally stored হয় না।

The following information MUST NOT be stored as reporter identity:

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

এই privacy model OpenWitness-এর core architectural requirement।

যদি ভবিষ্যতে কোনো feature-এর জন্য additional data প্রয়োজন হয়, সেটি database-এ যোগ করার আগে privacy এবং security review করতে হবে।

---

# 5. Bangladesh Location Model

OpenWitness শুধুমাত্র বাংলাদেশের জন্য।

Location hierarchy:

```text
বাংলাদেশ
   │
   ├── বিভাগ
   │      │
   │      └── জেলা
   │
   └── 8 Divisions
          │
          └── 64 Districts
```

Database-এ বর্তমানে:

```text
8 Divisions
64 Districts
```

রয়েছে।

একজন reporter প্রথমে বিভাগ নির্বাচন করবে।

তারপর শুধুমাত্র সেই বিভাগের অন্তর্ভুক্ত জেলা নির্বাচন করতে পারবে।

Database-level validation নিশ্চিত করে যে একটি district তার সঠিক division-এর সাথেই যুক্ত থাকে।

---

# 6. Language

OpenWitness-এর primary user interface ভাষা:

```text
বাংলা
```

Public-facing UI-তে English text ব্যবহার করা উচিত নয়, যদি না সেটি কোনো technical requirement বা unavoidable third-party element হয়।

Database-এর technical identifiers English-এ থাকবে:

```text
incidents
categories
divisions
districts
```

কিন্তু user-facing labels বাংলা হবে:

```text
ঘটনা
বিভাগ
জেলা
শ্রেণি
রিপোর্ট করুন
```

---

# 7. Technology Stack

## Frontend

```text
Next.js
React
TypeScript
Tailwind CSS
```

## Backend / Database

```text
Supabase
PostgreSQL
Supabase Auth
Supabase Row Level Security
```

## Database Management

```text
Supabase CLI
SQL migrations
```

## Source Control

```text
Git
GitHub
```

## Deployment

```text
Vercel
```

---

# 8. High-Level Architecture

```text
                         Internet
                            │
                            ▼
                     ┌─────────────┐
                     │   Vercel    │
                     │   Next.js   │
                     └──────┬──────┘
                            │
             ┌──────────────┴──────────────┐
             │                             │
             ▼                             ▼
      Public Application            Admin Application
             │                             │
             │                        Supabase Auth
             │                             │
             └──────────────┬──────────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │   Supabase    │
                    │  PostgreSQL   │
                    └───────┬───────┘
                            │
                 ┌──────────┼──────────┐
                 │          │          │
                 ▼          ▼          ▼
             Incidents   Locations  Moderation
```

---

# 9. Database Architecture

The V1 database contains:

```text
categories
divisions
districts
admin_users
incidents
moderation_actions
incident_reports
database_metadata
```

And one public-safe view:

```text
public_incidents
```

---

# 10. Database Relationship

```text
categories
    │
    └──────────────┐
                   │
divisions          │
    │              │
    └── districts  │
          │        │
          └────────┼── incidents
                   │       │
                   │       ├── moderation_actions
                   │       │
                   │       └── incident_reports
                   │
admin_users ───────┘
```

---

# 11. Database Tables

## categories

Stores incident categories.

Important fields:

```text
id
name
slug
description
is_active
sort_order
created_at
updated_at
```

---

## divisions

Stores the 8 divisions of Bangladesh.

Important fields:

```text
id
name
slug
sort_order
created_at
```

---

## districts

Stores the 64 districts of Bangladesh.

Important fields:

```text
id
division_id
name
slug
sort_order
created_at
```

Relationship:

```text
districts.division_id
        ↓
divisions.id
```

---

## incidents

Main anonymous reporting table.

Important fields:

```text
id
public_id
category_id
division_id
district_id
title
description
incident_date
status
verification_status
created_at
updated_at
published_at
```

Reporter identity is intentionally absent.

---

## admin_users

Maps Supabase Auth users to OpenWitness staff roles.

Roles:

```text
admin
moderator
```

Important fields:

```text
id
auth_user_id
display_name
role
is_active
created_at
updated_at
```

---

## moderation_actions

Stores moderation audit events.

Examples:

```text
started_review
approved
rejected
needs_revision
archived
edited
redacted
restored
```

---

## incident_reports

Allows public users to anonymously flag an approved incident.

Reasons include:

```text
personal_information
false_or_misleading
harassment_or_hate
threat_or_violence
duplicate
other
```

---

## database_metadata

Stores project/database metadata.

Examples:

```text
project_name
project_version
database_version
schema_status
developer
github_url
migration_name
migration_file
application
database
country
primary_language
privacy_model
```

---

# 12. Public Incident View

The application uses:

```text
public.public_incidents
```

This is a public-safe database view.

Only approved incidents are exposed.

The view does not expose:

```text
moderation data
admin data
internal status information
```

The view uses:

```text
security_invoker = true
```

so the underlying RLS security model remains applicable.

---

# 13. Incident Lifecycle

A new report starts as:

```text
pending
```

with:

```text
verification_status = reported
published_at = null
```

Possible lifecycle:

```text
                 ┌──────────────┐
                 │    pending   │
                 └──────┬───────┘
                        │
                        ▼
                ┌───────────────┐
                │ under_review  │
                └───────┬───────┘
                        │
             ┌──────────┼──────────┐
             │          │          │
             ▼          ▼          ▼
        approved    rejected   needs_revision
             │
             ▼
          published
```

Additional state:

```text
archived
```

---

# 14. Publication Rule

A public incident MUST satisfy:

```text
status = approved
```

and:

```text
published_at IS NOT NULL
```

An incident that is not approved must not be publicly visible.

This is enforced at the database layer.

---

# 15. Verification Status

Each incident has a verification status:

```text
reported
verified
disputed
```

### reported

The incident was submitted but has not yet been independently verified.

### verified

The moderation process has established sufficient confidence for the application's verification standard.

### disputed

There is a material dispute regarding the incident.

---

# 16. Moderation

OpenWitness has two staff roles.

## Moderator

A moderator can:

- View moderation queue
- Review incidents
- Update incidents
- Approve incidents
- Reject incidents
- Request revision
- Archive incidents
- Review public flags
- Create moderation actions

## Admin

An admin can do everything a moderator can do, plus:

- Manage administrators
- Manage moderators
- Manage categories
- Manage divisions
- Manage districts
- Delete incidents
- Manage staff access

---

# 17. Moderation Audit

Important moderation actions are recorded.

For example:

```text
pending
   ↓
under_review
```

creates:

```text
started_review
```

and:

```text
under_review
   ↓
approved
```

creates:

```text
approved
```

Content changes can also generate:

```text
edited
```

This audit mechanism is implemented at the database layer rather than relying only on frontend code.

---

# 18. Authentication

Public users:

```text
No authentication
```

Staff:

```text
Supabase Auth
```

The database maps authenticated Supabase users to:

```text
public.admin_users
```

using:

```text
auth_user_id
```

---

# 19. First Admin Bootstrap

The first admin is intentionally created manually.

## Step 1

Go to:

```text
Supabase Dashboard
→ Authentication
→ Users
→ Add user
```

Create the first staff account.

## Step 2

Copy the user's Auth UUID.

## Step 3

Open:

```text
Supabase Dashboard
→ SQL Editor
```

Run:

```sql
insert into public.admin_users (
  auth_user_id,
  display_name,
  role,
  is_active
)
values (
  'AUTH-USER-UUID',
  'Faruk Islam',
  'admin',
  true
);
```

Replace:

```text
AUTH-USER-UUID
```

with the actual Supabase Auth user's UUID.

---

# 20. Row Level Security

RLS is enabled on all application tables.

Protected tables include:

```text
categories
divisions
districts
admin_users
incidents
moderation_actions
incident_reports
database_metadata
```

The database also uses:

```text
FORCE ROW LEVEL SECURITY
```

where configured by the V1 migration.

---

# 21. Public Database Permissions

Anonymous users can:

```text
SELECT active categories
SELECT divisions
SELECT districts
INSERT incidents
INSERT incident_reports
```

Anonymous users cannot:

```text
SELECT pending incidents
SELECT rejected incidents
SELECT archived incidents
SELECT admin_users
SELECT moderation_actions
SELECT database_metadata
```

---

# 22. Staff Database Permissions

Authenticated staff can access protected resources only when they exist in:

```text
admin_users
```

and:

```text
is_active = true
```

Moderators and admins are separated using the `admin_role` enum.

---

# 23. Database Security

The V1 database uses:

```text
Row Level Security
Explicit GRANT
Explicit REVOKE
Least-privilege permissions
SECURITY DEFINER functions
Pinned search_path
Private security schema
Security-invoker public view
Foreign key constraints
Database triggers
Database validation
Audit logging
```

Security-sensitive functions are stored in:

```text
private
```

schema.

---

# 24. Rate Limiting

Rate limiting is NOT implemented by storing reporter IP addresses in the database.

The database intentionally does not store:

```text
ip_address
```

Abuse prevention/rate limiting should be handled at the application or infrastructure layer.

Any future implementation must preserve reporter anonymity.

---

# 25. Database Indexing

Indexes exist for:

- Category filtering
- Division filtering
- District filtering
- Public incident listing
- Moderation queue
- Verification filtering
- Foreign key relationships
- Moderation history
- Public flags

---

# 26. Database Migration Policy

The V1 migration is:

```text
20260825192716_create_openwitness_v1.sql
```

Migration name:

```text
create_openwitness_v1
```

This migration is:

```text
FROZEN
```

After production deployment:

```text
DO NOT EDIT
DO NOT RENAME
DO NOT DELETE
```

---

# 27. Future Database Changes

Never modify the V1 migration.

Future changes MUST use a new migration.

Example:

```powershell
supabase migration new add_evidence
```

Then:

```powershell
supabase db push --dry-run
```

After verification:

```powershell
supabase db push
```

---

# 28. Current Database Baseline

The production V1 database has been successfully deployed.

Migration:

```text
20260825192716_create_openwitness_v1.sql
```

Deployment:

```text
Successful
```

Verification:

```text
OPENWITNESS V1 DATABASE BASELINE: PASS
```

Expected seed data:

```text
Divisions: 8
Districts: 64
Categories: 16
```

---

# 29. Local Development Setup

## Requirements

```text
Node.js
npm
Git
Supabase CLI
```

Docker is NOT required for the current hosted-Supabase development workflow.

---

# 30. Install Dependencies

```powershell
npm install
```

---

# 31. Supabase Client

The project uses:

```text
@supabase/supabase-js
```

Install if necessary:

```powershell
npm install @supabase/supabase-js
```

---

# 32. Supabase CLI

Install:

```powershell
npm install -g supabase
```

Verify:

```powershell
supabase --version
```

---

# 33. Supabase Project

Login:

```powershell
supabase login
```

Link the project:

```powershell
supabase link --project-ref YOUR_PROJECT_REF
```

Do not expose access tokens or sensitive credentials in source control.

---

# 34. Environment Variables

Create:

```text
.env.local
```

Example:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

Use the actual values from Supabase.

---

# 35. Environment Variable Security

Never commit:

```text
.env.local
.env
.env.production
```

Never expose:

```text
SUPABASE_SERVICE_ROLE_KEY
```

through:

```text
NEXT_PUBLIC_*
```

The service-role key must remain server-side only.

---

# 36. Development Server

```powershell
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 37. Production Build

```powershell
npm run build
```

Then:

```powershell
npm start
```

---

# 38. Git Workflow

OpenWitness uses GitHub as the source of truth.

```text
Local Development
       ↓
Git
       ↓
GitHub
       ↓
Vercel
       ↓
Production
```

---

# 39. Commit Rules

Use meaningful commits.

Examples:

```text
feat: add anonymous incident submission
feat: add Bengali public incident listing
feat: add moderator dashboard
feat: add admin dashboard

fix: validate district selection
fix: protect incident publication state

refactor: improve incident query layer

docs: update deployment documentation

chore: update dependencies
```

---

# 40. Pull Request Rules

Before merging:

```powershell
npm run lint
npm run build
```

must pass.

For database changes:

```powershell
supabase db push --dry-run
```

must be reviewed before deployment.

---

# 41. Vercel Deployment

Deployment flow:

```text
GitHub
   ↓
Vercel
   ↓
Next.js Production
   ↓
Supabase
```

Required public environment variables:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Never expose the service-role key to the browser.

---

# 42. Application Structure

Recommended structure:

```text
openwitness/
│
├── app/
│   ├── page.tsx
│   ├── report/
│   ├── incidents/
│   ├── incidents/[id]/
│   └── admin/
│
├── components/
│
├── lib/
│   ├── supabase/
│   ├── incidents/
│   └── auth/
│
├── types/
│
├── public/
│
├── supabase/
│   ├── config.toml
│   └── migrations/
│
├── .env.local
├── .env.example
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── package.json
└── tsconfig.json
```

---

# 43. Public Application Pages

Expected public routes:

```text
/
```

Homepage.

```text
/report
```

Anonymous incident submission.

```text
/incidents
```

Approved public incidents.

```text
/incidents/[id]
```

Incident details.

Potential future pages:

```text
/about
/how-it-works
/privacy
/terms
/contact
```

All public pages should be Bengali-first.

---

# 44. Anonymous Report Form

The report form should contain:

```text
শিরোনাম
বিস্তারিত বিবরণ
বিভাগ
জেলা
ঘটনার তারিখ
শ্রেণি
```

The form must NOT request:

```text
নাম
ইমেইল
ফোন
ঠিকানা
অ্যাকাউন্ট
```

---

# 45. Cascading Location Selection

The UI must implement:

```text
বিভাগ নির্বাচন
      ↓
জেলা নির্বাচন
```

When the division changes:

```text
previous district selection
        ↓
reset
```

Only districts belonging to the selected division should be displayed.

The database also validates this relationship.

---

# 46. Public Incident Listing

Only approved incidents should appear publicly.

Recommended filters:

```text
বিভাগ
জেলা
শ্রেণি
তারিখ
```

Future search functionality should be introduced through an appropriate migration if database changes are required.

---

# 47. Admin Dashboard

Recommended areas:

```text
Dashboard
Reports
Moderation Queue
Flags
Categories
Locations
Staff
Settings
```

---

# 48. Moderator Dashboard

Moderators should have access to:

```text
Pending Reports
Under Review
Needs Revision
Approved
Rejected
Archived
Public Flags
Moderation History
```

They must not have unrestricted staff-management permissions.

---

# 49. Admin Security

Admin access must be verified server-side.

Do NOT rely only on:

```text
hidden UI
frontend route guards
client-side role checks
```

Authorization must ultimately be enforced through:

```text
Supabase Auth
+
admin_users
+
PostgreSQL RLS
```

---

# 50. AI Coding Agent Rules

AI coding agents MUST read:

```text
AGENTS.md
CLAUDE.md
README.md
```

before modifying the project.

Agents MUST:

- Preserve anonymous reporting.
- Preserve Bengali-first UI.
- Preserve database security.
- Preserve RLS.
- Use migrations for database changes.
- Never modify the frozen V1 migration.
- Never expose service-role credentials.
- Never add reporter identity without explicit approval.
- Run lint/build after significant code changes.
- Run migration dry-run before database deployment.

---

# 51. Privacy Requirements

OpenWitness follows data minimization.

The application should collect only information necessary for the report itself.

The database must not become an identity database.

The system must not silently introduce tracking mechanisms.

---

# 52. Security Requirements

Before production release:

```text
npm run lint
npm run build
```

Database changes:

```text
migration review
↓
dry-run
↓
production push
```

Security review should check:

```text
RLS
GRANTS
REVOKES
server authorization
environment variables
service-role usage
public API exposure
input validation
XSS prevention
CSRF considerations
rate limiting
spam prevention
```

---

# 53. Production Checklist

```text
[ ] Production Supabase project configured
[ ] V1 migration deployed
[ ] V1 migration frozen
[ ] 8 divisions verified
[ ] 64 districts verified
[ ] 16 categories verified
[ ] RLS verified
[ ] Admin account created
[ ] Moderator account tested
[ ] Admin dashboard protected
[ ] Public submission tested
[ ] Public listing tested
[ ] Moderation flow tested
[ ] Flagging flow tested
[ ] Environment variables configured
[ ] Service-role key protected
[ ] Vercel deployment configured
[ ] GitHub repository protected
[ ] npm run lint passes
[ ] npm run build passes
[ ] Privacy policy ready
[ ] Terms ready
[ ] Content policy ready
[ ] Rate limiting configured
[ ] Spam protection configured
[ ] Error handling tested
[ ] Backup strategy verified
```

---

# 54. Current Project State

```text
Next.js project                 ✓
TypeScript                      ✓
Tailwind CSS                   ✓
Supabase JS                    ✓
Supabase CLI                   ✓
Supabase CLI authentication    ✓
Supabase project linked        ✓
Supabase initialized            ✓
V1 migration created            ✓
V1 migration dry-run            ✓
V1 migration deployed           ✓
Database verification           ✓
8 divisions                    ✓
64 districts                   ✓
16 categories                  ✓
Database baseline               ✓
```

Final database verification:

```text
OPENWITNESS V1 DATABASE BASELINE: PASS
```

---

# 55. Repository

Official repository:

https://github.com/farukislamyt/openwitness

---

# 56. Development Philosophy

OpenWitness should prioritize:

```text
Privacy
Security
Correctness
Simplicity
Transparency
Maintainability
Accessibility
Performance
```

Features should not be added merely because they are technically possible.

Every feature should have clear public value and preserve the platform's privacy model.

---

# 57. Final Architecture Principle

```text
Anonymous Public Reporting
          +
Moderated Publication
          +
Database-Enforced Security
          +
Minimal Data Collection
```

The database is the security boundary.

The frontend is not trusted.

The public reporter is not authenticated.

The moderator is authenticated.

The administrator has elevated privileges.

All database changes are migration-controlled.

The V1 database baseline is frozen.

---

# 58. License

License:

```text
TBD
```

The final license should be selected before public distribution.

---

# 59. Maintainer

**Faruk Islam**

GitHub:

https://github.com/farukislamyt/openwitness

---

## OpenWitness

**বাংলাদেশের মানুষের জন্য একটি anonymous public-interest reporting platform।**

```text
Report anonymously.
Moderate responsibly.
Publish transparently.
Protect privacy.
```