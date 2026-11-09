-- Run this entire script in Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  preferred_language text not null default 'rw'
    check (preferred_language in ('rw','en','fr','sw','ar')),
  currency text not null default 'RWF',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('income','expense')),
  title text not null check (char_length(trim(title)) between 1 and 120),
  category text not null default 'Other',
  amount numeric(14,2) not null check (amount > 0),
  transaction_date date not null default current_date,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists transactions_user_date_idx
  on public.transactions(user_id, transaction_date desc);
create index if not exists transactions_user_type_idx
  on public.transactions(user_id, type);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.transactions enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles
  for select to authenticated using (auth.uid() = id);
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Users can view own transactions" on public.transactions;
create policy "Users can view own transactions" on public.transactions
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Users can insert own transactions" on public.transactions;
create policy "Users can insert own transactions" on public.transactions
  for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "Users can update own transactions" on public.transactions;
create policy "Users can update own transactions" on public.transactions
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Users can delete own transactions" on public.transactions;
create policy "Users can delete own transactions" on public.transactions
  for delete to authenticated using (auth.uid() = user_id);

-- Optional: enable realtime for transactions from Supabase Dashboard if desired.
