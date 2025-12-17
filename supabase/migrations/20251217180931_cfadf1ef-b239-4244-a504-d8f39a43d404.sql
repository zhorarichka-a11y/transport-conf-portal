-- Create saved_conferences table
CREATE TABLE public.saved_conferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  conference_id UUID NOT NULL REFERENCES public.conferences(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, conference_id)
);

-- Enable RLS
ALTER TABLE public.saved_conferences ENABLE ROW LEVEL SECURITY;

-- Users can view their own saved conferences
CREATE POLICY "Users can view own saved conferences"
ON public.saved_conferences
FOR SELECT
USING (auth.uid() = user_id);

-- Users can save conferences
CREATE POLICY "Users can save conferences"
ON public.saved_conferences
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can unsave conferences
CREATE POLICY "Users can unsave conferences"
ON public.saved_conferences
FOR DELETE
USING (auth.uid() = user_id);