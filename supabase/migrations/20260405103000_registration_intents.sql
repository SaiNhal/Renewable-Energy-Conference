CREATE TABLE public.registration_intents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  affiliation TEXT,
  country TEXT,
  designation TEXT,
  notes TEXT,
  plan_key TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  payment_provider TEXT NOT NULL,
  amount_usd NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'initiated',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.registration_intents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create registration intents"
  ON public.registration_intents
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view registration intents"
  ON public.registration_intents
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));
