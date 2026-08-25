/*
  OpenWitness V1
  Corrective Security Migration

  Purpose:
  - Fix anonymous access to active categories.
  - Prevent anon from evaluating private.is_admin().
  - Preserve admin access to inactive categories.
  - Do not grant anon EXECUTE on private security functions.

  Security model:
  anon/authenticated:
    SELECT active categories

  authenticated admin:
    SELECT all categories
*/

BEGIN;

-- Remove the mixed public/admin SELECT policy.
DROP POLICY IF EXISTS categories_select
ON public.categories;

-- Public read access.
-- No privileged security function is evaluated for anon users.
CREATE POLICY categories_public_select
ON public.categories
FOR SELECT
TO anon, authenticated
USING (
  is_active = true
);

-- Admin-only access to inactive categories.
CREATE POLICY categories_admin_select
ON public.categories
FOR SELECT
TO authenticated
USING (
  (SELECT private.is_admin())
);

COMMIT;