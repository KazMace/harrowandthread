-- Harrow & Thread — enquiry capture
--
-- Apply either via the Supabase MCP once authenticated, or by pasting this into
-- the Supabase SQL editor. Idempotent: safe to run more than once.
--
-- THE SECURITY MODEL, because it is the part that matters:
-- the anon key ships in the page source, so it is public. Everything below
-- exists to make that safe. The anon role may INSERT and nothing else. It
-- cannot read, update or delete. Without these policies anyone viewing the
-- page could read every enquiry ever received.

create table if not exists public.enquiries (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),

  -- required on the form
  name           text not null,
  email          text not null,
  iam            text,
  commission_type text,

  -- optional
  phone          text,
  location       text,
  size_w         text,
  size_h         text,
  size_unsure    text,
  design_tier    text,
  timeline       text,
  design_source  text,
  notes          text,
  marketing_consent text,

  -- storage paths of the customer's room photographs / references
  upload_paths   text[] not null default '{}'
);

comment on table public.enquiries is
  'Commission enquiries from the website. Written by the anon role via the REST API; insert-only.';

alter table public.enquiries enable row level security;

-- Insert-only for anonymous visitors. No select/update/delete policy exists,
-- and with RLS on, absence of a policy means denied.
drop policy if exists "anon can insert enquiries" on public.enquiries;
create policy "anon can insert enquiries"
  on public.enquiries for insert to anon
  with check (true);

-- Storage bucket for uploads. Private: no public read.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('enquiry-uploads', 'enquiry-uploads', false, 10485760,
        array['image/jpeg','image/png','image/webp'])
on conflict (id) do update
  set public = false,
      file_size_limit = 10485760,
      allowed_mime_types = array['image/jpeg','image/png','image/webp'];

drop policy if exists "anon can upload enquiry images" on storage.objects;
create policy "anon can upload enquiry images"
  on storage.objects for insert to anon
  with check (bucket_id = 'enquiry-uploads');

-- Reading uploads is for you, not the public. Authenticated users (you, signed
-- into the dashboard) can read; anonymous visitors cannot.
drop policy if exists "owner can read enquiry images" on storage.objects;
create policy "owner can read enquiry images"
  on storage.objects for select to authenticated
  using (bucket_id = 'enquiry-uploads');

-- Verification — run after applying. Expect exactly one policy on the table,
-- of type INSERT, for the anon role.
--
--   select tablename, policyname, cmd, roles
--     from pg_policies where tablename = 'enquiries';
--
-- And confirm anon genuinely cannot read. This must return 401/403 or an empty
-- result, never rows:
--
--   curl "$PUBLIC_SUPABASE_URL/rest/v1/enquiries?select=*" \
--        -H "apikey: $PUBLIC_SUPABASE_ANON_KEY"
