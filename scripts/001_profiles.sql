-- Create profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  bio text,
  mlbb_id text,
  mlbb_server text,
  mlbb_rank text default 'Warrior',
  main_role text default 'All Rounder',
  favorite_heroes text[] default '{}',
  total_earnings integer default 0,
  tournaments_won integer default 0,
  tournaments_played integer default 0,
  matches_won integer default 0,
  matches_played integer default 0,
  discord_id text,
  discord_username text,
  is_verified boolean default false,
  is_looking_for_team boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_all" on public.profiles for select using (true);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
