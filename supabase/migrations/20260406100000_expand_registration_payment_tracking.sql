ALTER TABLE public.registration_intents
ADD COLUMN currency TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN payment_status TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN payment_reference TEXT,
ADD COLUMN payment_session_id TEXT,
ADD COLUMN payment_order_id TEXT,
ADD COLUMN redirect_url TEXT,
ADD COLUMN gateway_response JSONB,
ADD COLUMN redirected_at TIMESTAMPTZ,
ADD COLUMN completed_at TIMESTAMPTZ,
ADD COLUMN cancelled_at TIMESTAMPTZ,
ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE OR REPLACE FUNCTION public.update_registration_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS registration_intents_set_updated_at ON public.registration_intents;

CREATE TRIGGER registration_intents_set_updated_at
BEFORE UPDATE ON public.registration_intents
FOR EACH ROW
EXECUTE FUNCTION public.update_registration_updated_at();

CREATE OR REPLACE FUNCTION public.update_registration_payment(
  p_registration_id UUID,
  p_payment_status TEXT,
  p_payment_reference TEXT DEFAULT NULL,
  p_payment_session_id TEXT DEFAULT NULL,
  p_payment_order_id TEXT DEFAULT NULL,
  p_gateway_response JSONB DEFAULT NULL
)
RETURNS public.registration_intents
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.registration_intents;
  v_status TEXT;
BEGIN
  v_status := CASE
    WHEN p_payment_status = 'paid' THEN 'registered'
    WHEN p_payment_status = 'cancelled' THEN 'cancelled'
    ELSE 'payment_pending'
  END;

  UPDATE public.registration_intents
  SET
    status = v_status,
    payment_status = p_payment_status,
    payment_reference = COALESCE(p_payment_reference, payment_reference),
    payment_session_id = COALESCE(p_payment_session_id, payment_session_id),
    payment_order_id = COALESCE(p_payment_order_id, payment_order_id),
    gateway_response = COALESCE(p_gateway_response, gateway_response),
    completed_at = CASE WHEN p_payment_status = 'paid' THEN now() ELSE completed_at END,
    cancelled_at = CASE WHEN p_payment_status = 'cancelled' THEN now() ELSE cancelled_at END
  WHERE id = p_registration_id
  RETURNING * INTO v_row;

  RETURN v_row;
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_registration_payment(UUID, TEXT, TEXT, TEXT, TEXT, JSONB) TO anon;
GRANT EXECUTE ON FUNCTION public.update_registration_payment(UUID, TEXT, TEXT, TEXT, TEXT, JSONB) TO authenticated;
