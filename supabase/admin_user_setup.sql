-- ========================================
-- ADMIN USER SETUP
-- ========================================
-- This script grants admin role to a user in Supabase.
--
-- IMPORTANT: You MUST complete ONE of the options below.
-- Do NOT run both options - choose one method and uncomment it.
--
-- See ADMIN_SETUP_GUIDE.md for step-by-step instructions.
-- ========================================

-- ========================================
-- OPTION 1: By User UUID (Recommended)
-- ========================================
-- How to get the UUID:
-- 1. Go to Supabase Dashboard → Authentication → Users
-- 2. Click on the user you want to make admin
-- 3. Copy the UUID field
-- 4. Replace 'YOUR_USER_UUID_HERE' below with the copied UUID
-- 5. Run this query
--
-- Example UUID: 550e8400-e29b-41d4-a716-446655440000

INSERT INTO public.user_roles (user_id, role)
VALUES ('YOUR_USER_UUID_HERE', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- ========================================
-- OPTION 2: By Email Address
-- ========================================
-- Uncomment the block below if you only know the email.
-- Replace 'your-admin@example.com' with the actual email.
--
-- This will find the user by email and assign admin role.

-- INSERT INTO public.user_roles (user_id, role)
-- SELECT id, 'admin'
-- FROM auth.users
-- WHERE email = 'your-admin@example.com'
-- ON CONFLICT (user_id, role) DO NOTHING;

-- ========================================
-- VERIFY: Run this to check if admin role was assigned
-- ========================================
-- SELECT u.email, ur.role
-- FROM auth.users u
-- LEFT JOIN public.user_roles ur ON u.id = ur.user_id
-- WHERE u.email = 'your-admin@example.com';
