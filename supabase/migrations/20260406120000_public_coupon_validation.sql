CREATE POLICY "Anyone can validate active coupons"
  ON public.coupon_codes
  FOR SELECT
  USING (
    is_active = true
    AND (valid_from IS NULL OR valid_from <= now())
    AND (valid_until IS NULL OR valid_until >= now())
    AND (max_uses IS NULL OR current_uses < max_uses)
  );
