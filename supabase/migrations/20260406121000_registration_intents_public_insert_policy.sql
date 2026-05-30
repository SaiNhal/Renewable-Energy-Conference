ALTER TABLE public.registration_intents ENABLE ROW LEVEL SECURITY;

GRANT INSERT ON public.registration_intents TO anon, authenticated;

DROP POLICY IF EXISTS "Anyone can create registration intents" ON public.registration_intents;

CREATE POLICY "Anyone can create registration intents"
  ON public.registration_intents
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
