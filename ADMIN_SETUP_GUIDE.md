# Admin Setup Guide

## Problem
Admin users cannot log in because they don't have the admin role assigned in the database.

## Solution: 3-Step Setup

### Step 1: Get Your Admin User UUID
Go to your **Supabase Dashboard** → **Authentication** → **Users**

1. Find the user account that should be admin (e.g., bellalaganesh2004@gmail.com)
2. Click on the user row
3. Copy the **UUID** from the details panel (looks like: `550e8400-e29b-41d4-a716-446655440000`)

### Step 2: Update and Run the SQL

Go to **Supabase Dashboard** → **SQL Editor** → **New Query**

**Replace the UUID in the SQL below with YOUR actual user UUID:**

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('YOUR_ACTUAL_UUID_HERE', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

**Example (with real UUID):**
```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

3. Click **Run** button
4. Verify: "Query executed successfully" message appears

### Step 3: Log In to Admin Panel

1. Make sure your app is running locally or check the live deployment
2. Go to `/admin-login`
3. Enter the admin email and password
4. Should now have access to the Admin Panel

---

## Troubleshooting

### "Login failed" or "Email not found"
- Make sure the user exists in Supabase Auth first
- Create the user at: Supabase Dashboard → Authentication → Users → Add user

### "Login successful but redirects to /admin-login"
- The user exists but doesn't have admin role
- Double-check you ran the SQL INSERT statement
- Verify the UUID is correct (copy-paste from Supabase, not manually typed)
- Refresh the browser (hard refresh with Cmd+Shift+R on Mac)

### "Error: 'bellalaganesh2004@gmail.com' not found"
- This email hasn't been created in Supabase yet
- You need to first create the auth user, then assign the admin role

---

## Alternative: Setup via Email (if UUID is unknown)

If you only know the email:

```sql
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'bellalaganesh2004@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
```

---

## Verify Admin Role Was Added

To confirm the admin role was successfully assigned:

```sql
SELECT u.email, ur.role
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'bellalaganesh2004@gmail.com';
```

You should see:
- Email: bellalaganesh2004@gmail.com
- Role: admin

If role is NULL, the INSERT didn't work - check the UUID again.
