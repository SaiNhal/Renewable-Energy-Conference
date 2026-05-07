-- Replace these values before running.
-- Option 1: insert directly with a known user UUID.

INSERT INTO public.user_roles (user_id, role)
VALUES ('REPLACE_WITH_AUTH_USER_UUID', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Option 2: if you know the admin email and want to assign by email,
-- uncomment this block and replace the email value.

-- INSERT INTO public.user_roles (user_id, role)
-- SELECT id, 'admin'
-- FROM auth.users
-- WHERE email = '[email protected]'
-- ON CONFLICT (user_id, role) DO NOTHING;
