ALTER TABLE public.abstract_submissions
ADD COLUMN website_url TEXT,
ADD COLUMN drive_url TEXT,
ADD COLUMN supporting_text TEXT,
ADD COLUMN file_paths JSONB,
ADD COLUMN voice_file_path TEXT,
ADD COLUMN voice_file_name TEXT;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'abstract-assets',
  'abstract-assets',
  false,
  52428800,
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/webp',
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/x-wav',
    'audio/webm',
    'audio/ogg',
    'text/plain'
  ]
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can upload abstract assets"
  ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'abstract-assets');

CREATE POLICY "Admins can view abstract assets"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'abstract-assets'
    AND public.has_role(auth.uid(), 'admin')
  );
