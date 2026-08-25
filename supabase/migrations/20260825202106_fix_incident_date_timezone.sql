/*
  OpenWitness V1
  Corrective Security / Data Integrity Migration

  Purpose:
  - Fix incident date validation for Bangladesh calendar dates.
  - Supabase/PostgreSQL database timezone remains UTC.
  - Incident validation explicitly uses Asia/Dhaka.
  - Preserve the existing protection against future incident dates.

  Previous behavior:
    new.incident_date > current_date

  Problem:
    current_date follows the database timezone (UTC).

  Correct behavior:
    new.incident_date >
      (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Dhaka')::date

  Result:
    The incident date is compared against the current
    calendar date in Bangladesh.
*/

BEGIN;

CREATE OR REPLACE FUNCTION private.validate_incident_date()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN

  IF new.incident_date >
     (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Dhaka')::date
  THEN

    RAISE EXCEPTION
      'Incident date cannot be in the future';

  END IF;

  RETURN new;

END;
$function$;

COMMIT;