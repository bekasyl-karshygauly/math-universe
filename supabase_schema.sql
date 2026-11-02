-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query).
-- The script is idempotent: it is safe to run again on an existing database
-- to apply updates.
--
-- Security model: clients can only READ their data directly. Every write that
-- affects XP, streaks, achievements or progress goes through the
-- security-definer functions below, which validate input and award XP on the
-- server, so the leaderboard cannot be edited from the browser console.

-- ───────────────────────── 1. Tables ─────────────────────────

create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text not null unique,
  avatar_url text,
  xp integer not null default 0,
  level integer not null default 1,
  streak integer not null default 0,
  last_active timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.user_achievements (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  achievement_key text not null,
  unlocked_at timestamptz not null default now(),
  unique(user_id, achievement_key)
);

create table if not exists public.quiz_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  topic text not null,
  score integer not null default 0,
  total integer not null default 0,
  time_spent integer not null default 0,
  created_at timestamptz not null default now()
);
alter table public.quiz_attempts add column if not exists xp_awarded integer not null default 0;

create table if not exists public.lesson_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  course_id text not null,
  lesson_index integer not null,
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  unique(user_id, course_id, lesson_index)
);
-- XP for a lesson is granted once, even if it is unmarked and marked again
alter table public.lesson_progress add column if not exists xp_awarded boolean not null default false;

-- Catalogs the server trusts. Keep in sync with src/data/courses.ts and src/data/achievements.ts.
create table if not exists public.course_catalog (
  course_id text primary key,
  lesson_count integer not null
);
insert into public.course_catalog (course_id, lesson_count) values
  ('basics', 4), ('algebra', 3), ('calc', 5), ('linal', 4), ('prob', 3)
on conflict (course_id) do update set lesson_count = excluded.lesson_count;

create table if not exists public.achievement_defs (
  key text primary key,
  xp_reward integer not null
);
insert into public.achievement_defs (key, xp_reward) values
  ('first_lesson', 50), ('streak_3', 75), ('streak_7', 150), ('streak_30', 500),
  ('quiz_10', 100), ('quiz_perfect', 200), ('lessons_10', 100), ('lessons_50', 300),
  ('course_complete', 250), ('level_5', 200), ('level_10', 500), ('algebra_master', 300)
on conflict (key) do update set xp_reward = excluded.xp_reward;

-- ───────────────────────── 2. Row Level Security ─────────────────────────

alter table public.profiles enable row level security;
alter table public.user_achievements enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.course_catalog enable row level security;
alter table public.achievement_defs enable row level security;

drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists "Users can view own achievements" on public.user_achievements;
drop policy if exists "Users can insert own achievements" on public.user_achievements;
drop policy if exists "Users can view own quiz attempts" on public.quiz_attempts;
drop policy if exists "Users can insert own quiz attempts" on public.quiz_attempts;
drop policy if exists "Users can view own lesson progress" on public.lesson_progress;
drop policy if exists "Users can upsert own lesson progress" on public.lesson_progress;
drop policy if exists "Users can update own lesson progress" on public.lesson_progress;
drop policy if exists "Catalog is readable" on public.course_catalog;
drop policy if exists "Achievement defs are readable" on public.achievement_defs;

-- Profiles: anyone can read (for leaderboard); owners may change only username/avatar (see grants)
create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);
create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "Users can view own achievements"
  on public.user_achievements for select using (auth.uid() = user_id);
create policy "Users can view own quiz attempts"
  on public.quiz_attempts for select using (auth.uid() = user_id);
create policy "Users can view own lesson progress"
  on public.lesson_progress for select using (auth.uid() = user_id);
create policy "Catalog is readable"
  on public.course_catalog for select using (true);
create policy "Achievement defs are readable"
  on public.achievement_defs for select using (true);

-- Column-level privileges: block direct writes to xp/level/streak and to progress tables
revoke insert, update, delete on public.profiles from anon, authenticated;
grant update (username, avatar_url) on public.profiles to authenticated;
revoke insert, update, delete on public.user_achievements from anon, authenticated;
revoke insert, update, delete on public.quiz_attempts from anon, authenticated;
revoke insert, update, delete on public.lesson_progress from anon, authenticated;
revoke insert, update, delete on public.course_catalog from anon, authenticated;
revoke insert, update, delete on public.achievement_defs from anon, authenticated;

-- ───────────────────────── 3. Internal helpers ─────────────────────────

-- Picks a free username, appending part of the user id on collision
create or replace function public._unique_username(p_base text, p_uid uuid)
returns text
language plpgsql security definer set search_path = public
as $$
declare
  v_name text := left(coalesce(nullif(trim(p_base), ''), 'user'), 24);
begin
  if exists (select 1 from profiles where username = v_name and id <> p_uid) then
    v_name := v_name || '_' || left(replace(p_uid::text, '-', ''), 6);
  end if;
  return v_name;
end;
$$;

-- Adds XP, recomputes level (200 XP per level) and updates the daily streak
create or replace function public._grant_xp(p_uid uuid, p_amount integer)
returns public.profiles
language plpgsql security definer set search_path = public
as $$
declare
  v_profile profiles;
  v_amount integer := greatest(coalesce(p_amount, 0), 0);
begin
  select * into v_profile from profiles where id = p_uid for update;
  if not found then
    raise exception 'profile not found';
  end if;

  update profiles set
    xp = xp + v_amount,
    level = (xp + v_amount) / 200 + 1,
    streak = case
      when last_active::date = current_date then greatest(streak, 1)
      when last_active::date = current_date - 1 then streak + 1
      else 1
    end,
    last_active = now()
  where id = p_uid
  returning * into v_profile;

  return v_profile;
end;
$$;

revoke execute on function public._unique_username(text, uuid) from public, anon, authenticated;
revoke execute on function public._grant_xp(uuid, integer) from public, anon, authenticated;

-- ───────────────────────── 4. Profile creation ─────────────────────────

-- Creates the profile server-side on sign-up. This works even when email
-- confirmation is enabled (the client has no session yet at that moment).
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, public._unique_username(coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)), new.id))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Called by the client on every session start: creates a missing profile
-- (accounts made before the trigger existed) and refreshes the daily streak.
create or replace function public.ensure_profile()
returns public.profiles
language plpgsql security definer set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_meta jsonb;
  v_email text;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  if not exists (select 1 from profiles where id = v_uid) then
    select raw_user_meta_data, email into v_meta, v_email from auth.users where id = v_uid;
    insert into profiles (id, username)
    values (v_uid, _unique_username(coalesce(v_meta->>'username', split_part(v_email, '@', 1)), v_uid))
    on conflict (id) do nothing;
  end if;

  return _grant_xp(v_uid, 0);
end;
$$;

-- ───────────────────────── 5. Progress & XP API ─────────────────────────

-- Marks a lesson done/undone. The first completion of each lesson grants 20 XP.
create or replace function public.set_lesson_progress(p_course_id text, p_lesson_index integer, p_completed boolean)
returns public.profiles
language plpgsql security definer set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_rows integer;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;
  if not exists (
    select 1 from course_catalog
    where course_id = p_course_id and p_lesson_index >= 0 and p_lesson_index < lesson_count
  ) then
    raise exception 'unknown lesson %/%', p_course_id, p_lesson_index;
  end if;

  insert into lesson_progress (user_id, course_id, lesson_index, completed, updated_at)
  values (v_uid, p_course_id, p_lesson_index, p_completed, now())
  on conflict (user_id, course_id, lesson_index)
  do update set completed = excluded.completed, updated_at = now();

  if p_completed then
    update lesson_progress set xp_awarded = true
    where user_id = v_uid and course_id = p_course_id and lesson_index = p_lesson_index and not xp_awarded;
    get diagnostics v_rows = row_count;
    if v_rows > 0 then
      return _grant_xp(v_uid, 20);
    end if;
  end if;

  return _grant_xp(v_uid, 0);
end;
$$;

-- Stores a quiz result. Grants 5 XP per correct answer, at most 150 XP from quizzes per day.
create or replace function public.record_quiz_attempt(p_topic text, p_score integer, p_total integer, p_time_spent integer)
returns public.profiles
language plpgsql security definer set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_today integer;
  v_xp integer;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;
  if p_total < 1 or p_total > 50 or p_score < 0 or p_score > p_total or p_time_spent < 0 then
    raise exception 'invalid quiz result';
  end if;
  if p_topic <> 'all' and not exists (select 1 from course_catalog where course_id = p_topic) then
    raise exception 'unknown topic %', p_topic;
  end if;

  select coalesce(sum(xp_awarded), 0) into v_today
  from quiz_attempts
  where user_id = v_uid and created_at::date = current_date;
  v_xp := least(p_score * 5, greatest(0, 150 - v_today));

  insert into quiz_attempts (user_id, topic, score, total, time_spent, xp_awarded)
  values (v_uid, p_topic, p_score, p_total, p_time_spent, v_xp);

  return _grant_xp(v_uid, v_xp);
end;
$$;

-- Evaluates every achievement condition on the server and unlocks the ones
-- that are met. Returns the keys unlocked by this call.
create or replace function public.check_achievements()
returns text[]
language plpgsql security definer set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_new text[] := '{}';
  v_lessons integer;
  v_quizzes integer;
  v_perfect boolean;
  v_course boolean;
  v_algebra boolean;
  v_profile profiles;
  v_key text;
  v_reward integer;
  v_unlocked_any boolean;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  select count(*) into v_lessons from lesson_progress where user_id = v_uid and completed;
  select count(*), coalesce(bool_or(total > 0 and score = total), false)
    into v_quizzes, v_perfect
    from quiz_attempts where user_id = v_uid;
  select coalesce(bool_or(lp.done >= c.lesson_count), false),
         coalesce(bool_or(c.course_id = 'algebra' and lp.done >= c.lesson_count), false)
    into v_course, v_algebra
    from course_catalog c
    join (
      select course_id, count(*) as done from lesson_progress
      where user_id = v_uid and completed group by course_id
    ) lp using (course_id);

  -- Repeat because XP from one achievement can unlock a level achievement
  loop
    v_unlocked_any := false;
    select * into v_profile from profiles where id = v_uid;

    for v_key, v_reward in
      select d.key, d.xp_reward from achievement_defs d
      where not exists (select 1 from user_achievements ua where ua.user_id = v_uid and ua.achievement_key = d.key)
        and case d.key
          when 'first_lesson' then v_lessons >= 1
          when 'lessons_10' then v_lessons >= 10
          when 'lessons_50' then v_lessons >= 50
          when 'quiz_10' then v_quizzes >= 10
          when 'quiz_perfect' then v_perfect
          when 'course_complete' then v_course
          when 'algebra_master' then v_algebra
          when 'streak_3' then v_profile.streak >= 3
          when 'streak_7' then v_profile.streak >= 7
          when 'streak_30' then v_profile.streak >= 30
          when 'level_5' then v_profile.level >= 5
          when 'level_10' then v_profile.level >= 10
          else false
        end
    loop
      insert into user_achievements (user_id, achievement_key) values (v_uid, v_key)
      on conflict (user_id, achievement_key) do nothing;
      if found then
        perform _grant_xp(v_uid, v_reward);
        v_new := v_new || v_key;
        v_unlocked_any := true;
      end if;
    end loop;

    exit when not v_unlocked_any;
  end loop;

  return v_new;
end;
$$;

revoke execute on function public.ensure_profile() from public, anon;
revoke execute on function public.set_lesson_progress(text, integer, boolean) from public, anon;
revoke execute on function public.record_quiz_attempt(text, integer, integer, integer) from public, anon;
revoke execute on function public.check_achievements() from public, anon;
grant execute on function public.ensure_profile() to authenticated;
grant execute on function public.set_lesson_progress(text, integer, boolean) to authenticated;
grant execute on function public.record_quiz_attempt(text, integer, integer, integer) to authenticated;
grant execute on function public.check_achievements() to authenticated;
