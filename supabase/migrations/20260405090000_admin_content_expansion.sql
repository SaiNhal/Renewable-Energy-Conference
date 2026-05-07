CREATE TABLE public.media_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tier TEXT DEFAULT 'Media Partner',
  website_url TEXT,
  logo_url TEXT,
  description TEXT,
  display_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.media_partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view visible media partners"
  ON public.media_partners
  FOR SELECT
  USING (is_visible = true);
CREATE POLICY "Admins can manage media partners"
  ON public.media_partners
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.site_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data_key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  value TEXT,
  group_name TEXT DEFAULT 'general',
  value_type TEXT DEFAULT 'text',
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.site_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view public site data"
  ON public.site_data
  FOR SELECT
  USING (is_public = true);
CREATE POLICY "Admins can manage site data"
  ON public.site_data
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.information_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  content TEXT,
  category TEXT DEFAULT 'general',
  cta_label TEXT,
  cta_url TEXT,
  display_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.information_blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view visible information blocks"
  ON public.information_blocks
  FOR SELECT
  USING (is_visible = true);
CREATE POLICY "Admins can manage information blocks"
  ON public.information_blocks
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_media_partners_updated_at
BEFORE UPDATE ON public.media_partners
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_data_updated_at
BEFORE UPDATE ON public.site_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_information_blocks_updated_at
BEFORE UPDATE ON public.information_blocks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
