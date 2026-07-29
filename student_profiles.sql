-- student_profiles.sql
-- Run this in your Supabase SQL Editor to support the authentication & profile flow

CREATE TABLE IF NOT EXISTS public.student_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    current_class TEXT NOT NULL,
    school TEXT,
    age INTEGER,
    profile_image_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;

-- Setup RLS Policies
CREATE POLICY "Allow users to read their own profile" 
ON public.student_profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Allow users to insert their own profile" 
ON public.student_profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow users to update their own profile" 
ON public.student_profiles FOR UPDATE 
USING (auth.uid() = id);
