
-- Lessons table to store generated lessons
CREATE TABLE public.lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic TEXT NOT NULL,
  subject TEXT NOT NULL DEFAULT 'general',
  grade_level INTEGER NOT NULL DEFAULT 8,
  slides JSONB NOT NULL DEFAULT '[]'::jsonb,
  mcqs JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS but allow public access (no auth required for this app)
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read lessons" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Anyone can insert lessons" ON public.lessons FOR INSERT WITH CHECK (true);
