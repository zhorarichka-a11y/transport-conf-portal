-- Add RLS policy for updating conferences
CREATE POLICY "Anyone can update conferences" 
ON public.conferences 
FOR UPDATE 
USING (true)
WITH CHECK (true);