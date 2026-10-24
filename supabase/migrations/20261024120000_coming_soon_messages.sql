-- Contact messages from the surajdhal.com Coming Soon page.
--
-- Access model:
--   * RLS is on. The only policy lets the anon role INSERT; nobody can read,
--     update or delete through the API. Messages are read in the Supabase
--     dashboard (or with the service role, which bypasses RLS).
--   * anon may only supply name, email and message. id, created_at and source
--     are always set by the database.
--   * A trigger caps submissions per email address and overall, so the
--     publishable key cannot be used to flood the table.

create table public.coming_soon_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  message text not null,
  source text not null default 'coming-soon',
  constraint coming_soon_messages_name_length check (char_length(btrim(name)) between 1 and 100),
  constraint coming_soon_messages_email_length check (char_length(email) between 3 and 254),
  constraint coming_soon_messages_email_format check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  constraint coming_soon_messages_message_length check (char_length(btrim(message)) between 1 and 5000)
);

comment on table public.coming_soon_messages is
  'Contact form submissions from the surajdhal.com Coming Soon page. Insert-only for anon.';

create index coming_soon_messages_created_at_idx
  on public.coming_soon_messages (created_at desc);

create index coming_soon_messages_email_created_at_idx
  on public.coming_soon_messages (lower(email), created_at desc);

alter table public.coming_soon_messages enable row level security;

-- Supabase grants all table privileges to API roles by default; narrow them.
revoke all on table public.coming_soon_messages from anon, authenticated;
grant insert (name, email, message) on table public.coming_soon_messages to anon;

create policy "Anyone can submit a coming soon message"
  on public.coming_soon_messages
  for insert
  to anon
  with check (source = 'coming-soon');

-- Rate limiting. SECURITY DEFINER so it can count rows the anon role cannot
-- read; trigger functions cannot be called through the API.
create function public.coming_soon_messages_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (
    select count(*)
    from public.coming_soon_messages
    where lower(email) = lower(new.email)
      and created_at > now() - interval '1 hour'
  ) >= 3 then
    raise exception 'rate_limited' using errcode = 'P0001', hint = 'per_email';
  end if;

  if (
    select count(*)
    from public.coming_soon_messages
    where created_at > now() - interval '1 hour'
  ) >= 100 then
    raise exception 'rate_limited' using errcode = 'P0001', hint = 'global';
  end if;

  return new;
end;
$$;

revoke all on function public.coming_soon_messages_rate_limit() from public, anon, authenticated;

create trigger coming_soon_messages_rate_limit
  before insert on public.coming_soon_messages
  for each row
  execute function public.coming_soon_messages_rate_limit();
