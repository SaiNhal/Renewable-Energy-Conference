-- Add coupon_code column to registration_intents so frontend can store applied coupons

ALTER TABLE public.registration_intents
ADD COLUMN IF NOT EXISTS coupon_code TEXT;

-- No row-level security changes required; existing insert policy allows any inserts.
