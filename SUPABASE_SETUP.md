# Supabase Setup

This project stores all real website data in your existing Supabase project.

## Data Storage

These tables are used by the website:

- `registration_intents`
  Used for attendee registrations before redirecting to Stripe or PayPal.

- `abstract_submissions`
  Used for abstract/paper submissions.

- `contact_messages`
  Used for contact form submissions.

- `speakers`
  Used for public speaker profiles.

- `media_partners`
  Used for media partner cards.

- `site_data`
  Used for editable website text like hero/footer details.

- `information_blocks`
  Used for homepage information cards.

- `website_content`
  Used for generic editable content sections.

- `coupon_codes`
  Used for coupon management.

- `user_roles`
  Used to mark a user as `admin`.

## What To Run In Supabase

Open your Supabase project:

`https://supabase.com/dashboard/project/zdxtnadjxjwtgqyzrkxj`

Then go to:

`SQL Editor`

Run the migration files in this order:

1. [20260327043155_5dbe4cd9](C:/Users/ganes/Downloads/reproject2changes/supabase/migrations/20260327043155_5dbe4cd9)
2. [20260405090000_admin_content_expansion.sql](C:/Users/ganes/Downloads/reproject2changes/supabase/migrations/20260405090000_admin_content_expansion.sql)
3. [20260405103000_registration_intents.sql](C:/Users/ganes/Downloads/reproject2changes/supabase/migrations/20260405103000_registration_intents.sql)
4. [20260405113000_contact_and_abstract_submissions.sql](C:/Users/ganes/Downloads/reproject2changes/supabase/migrations/20260405113000_contact_and_abstract_submissions.sql)

## Create Admin Login

1. In Supabase Dashboard, open `Authentication` -> `Users`.
2. Create a user with your admin email and password.
3. Copy that user's UUID.
4. Open `SQL Editor`.
5. Run [admin_user_setup.sql](C:/Users/ganes/Downloads/reproject2changes/supabase/admin_user_setup.sql) after replacing the placeholders.

After that, log in at:

`/admin-login`

## Payment Links

Add these variables to your local `.env`:

```env
VITE_STRIPE_PAYMENT_LINK_STUDENT=""
VITE_STRIPE_PAYMENT_LINK_ACADEMIC=""
VITE_STRIPE_PAYMENT_LINK_BUSINESS=""

VITE_PAYPAL_PAYMENT_LINK_STUDENT=""
VITE_PAYPAL_PAYMENT_LINK_ACADEMIC=""
VITE_PAYPAL_PAYMENT_LINK_BUSINESS=""
```

These should be hosted checkout links from Stripe and PayPal.

## Where You Will See Data

After setup:

- attendee registrations appear in `/admin` -> `Submissions` -> `Registrations`
- abstract submissions appear in `/admin` -> `Submissions` -> `Abstracts`
- contact messages appear in `/admin` -> `Submissions` -> `Messages`

## If You Want Me To Continue

I can do the next parts too, but I would need one of these from you:

- your admin email address, so I can tailor the SQL
- your Stripe hosted payment links
- your PayPal checkout links
- confirmation that you want a downloadable/exportable admin table next
