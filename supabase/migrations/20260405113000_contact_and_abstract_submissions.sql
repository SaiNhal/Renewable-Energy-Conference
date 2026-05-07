CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create contact messages"
  ON public.contact_messages
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view contact messages"
  ON public.contact_messages
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.abstract_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  affiliation TEXT NOT NULL,
  country TEXT,
  presentation_type TEXT,
  abstract_title TEXT NOT NULL,
  abstract_text TEXT NOT NULL,
  keywords TEXT,
  status TEXT NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.abstract_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create abstract submissions"
  ON public.abstract_submissions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view abstract submissions"
  ON public.abstract_submissions
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));
