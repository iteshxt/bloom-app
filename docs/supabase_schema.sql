-- SQL script to setup Bloom Accountability app database

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 2. Profiles Table
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    display_name text,
    avatar_url text,
    leetcode_username text,
    timezone text default 'UTC' not null,
    freeze_tokens integer default 3 not null,
    theme_slug text default 'bloom' not null
);

-- Enable RLS on Profiles
alter table public.profiles enable row level security;

-- 3. Partner Links Table (1-to-1 connection mapping)
create table if not exists public.partner_links (
    id uuid default uuid_generate_v4() primary key,
    user_one_id uuid references public.profiles(id) on delete cascade not null,
    user_two_id uuid references public.profiles(id) on delete cascade not null,
    status text check (status in ('pending', 'active')) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint unique_partner_pair unique (user_one_id, user_two_id),
    constraint no_self_link check (user_one_id <> user_two_id)
);

alter table public.partner_links enable row level security;

-- Partner ID helper function
create or replace function public.get_partner_id(user_uuid uuid)
returns uuid as $$
  select case 
    when user_one_id = user_uuid then user_two_id
    else user_one_id
  end
  from public.partner_links
  where (user_one_id = user_uuid or user_two_id = user_uuid) and status = 'active'
  limit 1;
$$ language sql security definer;

-- 4. Missions Table
create table if not exists public.missions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    name text not null,
    category text not null,
    goal_value integer not null,
    unit text not null,
    verification_type text check (verification_type in ('manual', 'timer', 'leetcode')) not null,
    repeat_schedule text default 'daily' not null,
    color_hex text not null,
    is_archived boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.missions enable row level security;

-- 5. Mission Completions Table
create table if not exists public.mission_completions (
    id uuid default uuid_generate_v4() primary key,
    mission_id uuid references public.missions(id) on delete cascade not null,
    completed_date date not null,
    current_value integer not null,
    is_completed boolean default false not null,
    verified_at timestamp with time zone,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint unique_mission_day unique (mission_id, completed_date)
);

alter table public.mission_completions enable row level security;

-- 6. Focus Sessions Table
create table if not exists public.focus_sessions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    start_time timestamp with time zone not null,
    end_time timestamp with time zone,
    duration_seconds integer default 0 not null,
    category text,
    is_completed boolean default false not null
);

alter table public.focus_sessions enable row level security;

-- 7. Presence States Table (Dynamic indicators)
create table if not exists public.presence_states (
    user_id uuid references public.profiles(id) on delete cascade primary key,
    status text check (status in ('offline', 'online', 'studying', 'break', 'busy', 'sleeping')) not null,
    last_active timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.presence_states enable row level security;

-- 8. Calendar Events Table
create table if not exists public.calendar_events (
    id uuid default uuid_generate_v4() primary key,
    created_by uuid references public.profiles(id) on delete cascade not null,
    title text not null,
    description text,
    event_date date not null,
    event_type text check (event_type in ('personal', 'partner', 'shared', 'deadline')) not null,
    repeat_type text check (repeat_type in ('none', 'daily', 'weekly', 'monthly')) default 'none' not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.calendar_events enable row level security;

-- 9. Reflections Table (Journal logs)
create table if not exists public.reflections (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    reflection_date date not null,
    thought_of_day text,
    wins text,
    challenges text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint unique_reflection_day unique (user_id, reflection_date)
);

alter table public.reflections enable row level security;

-- 10. Mood Entries Table (Evening checks)
create table if not exists public.mood_entries (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    entry_date date not null,
    mood_score integer check (mood_score between 1 and 5) not null,
    distraction_tags text[],
    custom_notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint unique_mood_day unique (user_id, entry_date)
);

alter table public.mood_entries enable row level security;

-- 11. Streaks Table
create table if not exists public.streaks (
    user_id uuid references public.profiles(id) on delete cascade primary key,
    current_streak integer default 0 not null,
    longest_streak integer default 0 not null,
    last_completion_date date,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.streaks enable row level security;

-- RLS Policies Setup
-- Profiles
create policy "Users can view own and partner profile" on public.profiles
    for select using (auth.uid() = id or id = public.get_partner_id(auth.uid()));
create policy "Users can update own profile" on public.profiles
    for update using (auth.uid() = id);

-- Partner Links
create policy "Users can view active/pending links" on public.partner_links
    for select using (auth.uid() = user_one_id or auth.uid() = user_two_id);
create policy "Users can insert partner link" on public.partner_links
    for insert with check (auth.uid() = user_one_id);
create policy "Users can update partner link status" on public.partner_links
    for update using (auth.uid() = user_one_id or auth.uid() = user_two_id);

-- Missions
create policy "Users can view own & partner missions" on public.missions
    for select using (auth.uid() = user_id or user_id = public.get_partner_id(auth.uid()));
create policy "Users can manage own missions" on public.missions
    for all using (auth.uid() = user_id);

-- Mission Completions
create policy "Users can view completions" on public.mission_completions
    for select using (
        exists (
            select 1 from public.missions m 
            where m.id = mission_id and (m.user_id = auth.uid() or m.user_id = public.get_partner_id(auth.uid()))
        )
    );
create policy "Users can manage own completions" on public.mission_completions
    for all using (
        exists (
            select 1 from public.missions m 
            where m.id = mission_id and m.user_id = auth.uid()
        )
    );

-- Focus Sessions
create policy "Users can view own & partner focus sessions" on public.focus_sessions
    for select using (auth.uid() = user_id or user_id = public.get_partner_id(auth.uid()));
create policy "Users can manage own focus sessions" on public.focus_sessions
    for all using (auth.uid() = user_id);

-- Presence States
create policy "Users can view presence states" on public.presence_states
    for select using (auth.uid() = user_id or user_id = public.get_partner_id(auth.uid()));
create policy "Users can manage own presence" on public.presence_states
    for all using (auth.uid() = user_id);

-- Calendar Events
create policy "Users can view events" on public.calendar_events
    for select using (auth.uid() = created_by or created_by = public.get_partner_id(auth.uid()));
create policy "Users can manage own events" on public.calendar_events
    for all using (auth.uid() = created_by);

-- Reflections
create policy "Users can view own & partner reflections" on public.reflections
    for select using (auth.uid() = user_id or user_id = public.get_partner_id(auth.uid()));
create policy "Users can manage own reflections" on public.reflections
    for all using (auth.uid() = user_id);

-- Mood Entries
create policy "Users can view own & partner mood entries" on public.mood_entries
    for select using (auth.uid() = user_id or user_id = public.get_partner_id(auth.uid()));
create policy "Users can manage own mood entries" on public.mood_entries
    for all using (auth.uid() = user_id);

-- Streaks
create policy "Users can view streaks" on public.streaks
    for select using (auth.uid() = user_id or user_id = public.get_partner_id(auth.uid()));

-- Profiles Trigger (auto create profiles, streaks, presence_states when a user signs up)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (new.id, split_part(new.email, '@', 1), '');
  
  insert into public.streaks (user_id)
  values (new.id);
  
  insert into public.presence_states (user_id, status)
  values (new.id, 'offline');
  
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Indexes for performance
create index if not exists idx_missions_user_id on public.missions(user_id) where is_archived = false;
create index if not exists idx_mission_completions_date on public.mission_completions(completed_date, mission_id);
create index if not exists idx_focus_sessions_user_time on public.focus_sessions(user_id, start_time desc);
create index if not exists idx_partner_links_lookup on public.partner_links(user_one_id, user_two_id);
