-- Run this once in the Supabase SQL Editor.
-- Each authenticated user can only read and write their own last-learning row.

ALTER TABLE public.last_learning ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON public.last_learning TO authenticated;
DO $$
BEGIN
  IF to_regclass('public.last_learning_id_seq') IS NOT NULL THEN
    GRANT USAGE, SELECT ON SEQUENCE public.last_learning_id_seq TO authenticated;
  END IF;
END
$$;

DROP POLICY IF EXISTS "Users can read own last learning" ON public.last_learning;
CREATE POLICY "Users can read own last learning"
ON public.last_learning
FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own last learning" ON public.last_learning;
CREATE POLICY "Users can insert own last learning"
ON public.last_learning
FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own last learning" ON public.last_learning;
CREATE POLICY "Users can update own last learning"
ON public.last_learning
FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);

-- Required for one durable last-learning row per user.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'last_learning_user_id_key'
      AND conrelid = 'public.last_learning'::regclass
  ) THEN
    ALTER TABLE public.last_learning
      ADD CONSTRAINT last_learning_user_id_key UNIQUE (user_id);
  END IF;
END
$$;
