-- schema.sql
-- Copy and paste this script into your Supabase SQL Editor (Dashboard > SQL Editor > New query)

-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY, -- Can be Supabase User UUID or local cookie identifier
    full_name TEXT NOT NULL,
    current_class TEXT DEFAULT 'Grade 5',
    school TEXT,
    age INTEGER,
    daily_goal_mins INTEGER DEFAULT 60,
    student_mins INTEGER DEFAULT 42,
    percent_complete INTEGER DEFAULT 65,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create open policy for profiles (simulated sandbox access, customize in production)
CREATE POLICY "Allow public read access to profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to profiles" ON public.profiles FOR UPDATE USING (true);


-- 2. Create Weaknesses Table
CREATE TABLE IF NOT EXISTS public.weaknesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    score NUMERIC NOT NULL, -- Accuracy score between 0.0 and 1.0
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.weaknesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to weaknesses" ON public.weaknesses FOR ALL USING (true) WITH CHECK (true);


-- 3. Create Tutor Messages Table
CREATE TABLE IF NOT EXISTS public.tutor_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    sender TEXT CHECK (sender IN ('USER', 'AI')) NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.tutor_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to tutor_messages" ON public.tutor_messages FOR ALL USING (true) WITH CHECK (true);


-- 4. Create Quiz Attempts Table
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    topic_id TEXT NOT NULL,
    score INTEGER NOT NULL, -- Score from 0 to 100
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to quiz_attempts" ON public.quiz_attempts FOR ALL USING (true) WITH CHECK (true);

-- Add quiz_type and chapter_id to support prerequisite + chapter-end tests
ALTER TABLE public.quiz_attempts
  ADD COLUMN IF NOT EXISTS quiz_type TEXT DEFAULT 'chapter_end'
    CHECK (quiz_type IN ('prerequisite', 'chapter_end')),
  ADD COLUMN IF NOT EXISTS chapter_id TEXT;
