-- Run once in the Supabase SQL Editor.
-- Users may only read and write their own topic-progress rows.

ALTER TABLE public.user_topic_progress ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON public.user_topic_progress TO authenticated;

DROP POLICY IF EXISTS "Users can read own topic progress" ON public.user_topic_progress;
CREATE POLICY "Users can read own topic progress"
ON public.user_topic_progress
FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own topic progress" ON public.user_topic_progress;
CREATE POLICY "Users can insert own topic progress"
ON public.user_topic_progress
FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own topic progress" ON public.user_topic_progress;
CREATE POLICY "Users can update own topic progress"
ON public.user_topic_progress
FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);
