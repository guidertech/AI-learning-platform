-- schema.sql
-- Copy and paste this script into your Supabase SQL Editor (Dashboard > SQL Editor > New query)

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT,
    full_name TEXT,
    school TEXT,
    age SMALLINT,
    class_id SMALLINT,
    profile_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create open policy for users (simulated sandbox access, customize in production)
CREATE POLICY "Allow public read access to users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to users" ON public.users FOR UPDATE USING (true);


-- 2. Create Weaknesses Table
CREATE TABLE IF NOT EXISTS public.weaknesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
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
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    sender TEXT CHECK (sender IN ('USER', 'AI')) NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.tutor_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to tutor_messages" ON public.tutor_messages FOR ALL USING (true) WITH CHECK (true);


-- 4. Create Quiz Attempts Table
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE,
    total_marks INTEGER DEFAULT 20,
    obtain_marks INTEGER,
    topic_id TEXT, -- Legacy / Optional
    score INTEGER, -- Legacy / Optional
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    quiz_type TEXT DEFAULT 'chapter_end' CHECK (quiz_type IN ('prerequisite', 'chapter_end'))
);

ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to quiz_attempts" ON public.quiz_attempts FOR ALL USING (true) WITH CHECK (true);

-- 5. Create Classes Table
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_number SMALLINT NOT NULL,
    class_name TEXT NOT NULL
);

ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to classes" ON public.classes FOR ALL USING (true) WITH CHECK (true);

-- Insert Seed Data for Classes
INSERT INTO public.classes (class_number, class_name) VALUES 
(1, 'Grade 1'),
(2, 'Grade 2'),
(3, 'Grade 3'),
(4, 'Grade 4'),
(5, 'Grade 5'),
(6, 'Grade 6'),
(7, 'Grade 7'),
(8, 'Grade 8')
ON CONFLICT DO NOTHING;

-- 6. Create Subjects Table
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id SMALLINT NOT NULL,
    name TEXT NOT NULL,
    icon TEXT
);

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to subjects" ON public.subjects FOR ALL USING (true) WITH CHECK (true);

-- 7. Create Chapters Table
CREATE TABLE IF NOT EXISTS public.chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    order_index SMALLINT NOT NULL DEFAULT 0,
    requires_prerequisite BOOLEAN DEFAULT false,
    prerequisite_completed BOOLEAN DEFAULT false,
    chapter_notes TEXT
);

-- Note: Run this in Supabase SQL Editor if chapters table already exists:
-- ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS chapter_notes TEXT;

ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to chapters" ON public.chapters FOR ALL USING (true) WITH CHECK (true);

-- 8. Create Topics Table
CREATE TABLE IF NOT EXISTS public.topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    order_index SMALLINT NOT NULL DEFAULT 0
);

ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to topics" ON public.topics FOR ALL USING (true) WITH CHECK (true);


-- 9. Create User Topic Progress Table
CREATE TABLE IF NOT EXISTS public.user_topic_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, topic_id)
);

ALTER TABLE public.user_topic_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to user_topic_progress" ON public.user_topic_progress FOR ALL USING (true) WITH CHECK (true);
