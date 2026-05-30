-- Create coupon validation function for registration coupon codes.
-- This function is called from the front-end via Supabase RPC.

CREATE OR REPLACE FUNCTION public.validate_registration_coupon(
  p_code TEXT,
  p_email TEXT,
  p_amount NUMERIC
)
RETURNS TABLE (
  coupon_id UUID,
  code TEXT,
  description TEXT,
  discount_percent INT,
  discount_amount NUMERIC,
  calculated_discount NUMERIC,
  max_uses INT,
  current_uses INT,
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  message TEXT
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.code,
    c.description,
    c.discount_percent,
    c.discount_amount,
    CASE
      WHEN c.discount_amount IS NOT NULL AND c.discount_amount > 0 THEN LEAST(c.discount_amount, p_amount)
      WHEN c.discount_percent IS NOT NULL AND c.discount_percent > 0 THEN LEAST((p_amount * c.discount_percent) / 100, p_amount)
      ELSE 0
    END::NUMERIC AS calculated_discount,
    c.max_uses,
    c.current_uses,
    c.valid_from,
    c.valid_until,
    NULL::TEXT AS message
  FROM public.coupon_codes c
  WHERE upper(c.code) = upper(p_code)
    AND c.is_active = TRUE
    AND (c.valid_from IS NULL OR c.valid_from <= now())
    AND (c.valid_until IS NULL OR c.valid_until >= now())
    AND (c.max_uses IS NULL OR c.current_uses < c.max_uses)
  LIMIT 1;
END;
$$;
