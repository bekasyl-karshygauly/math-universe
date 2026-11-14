begin;

-- Private tables store one row per visitor and one row per study account.
create schema if not exists mathuni_activity;
revoke all on schema mathuni_activity from public, anon, authenticated;
grant usage on schema mathuni_activity to anon, authenticated;

create table mathuni_activity.visitors (
  is_guest boolean not null,
  visitor_id uuid not null,
  seen_on date not null,
  primary key (is_guest, visitor_id)
);
alter table mathuni_activity.visitors enable row level security;
create index activity_visitors_seen_idx on mathuni_activity.visitors (seen_on);

create table mathuni_activity.students (
  user_id uuid primary key references auth.users(id) on delete cascade,
  course_id text references public.course_catalog(course_id),
  lesson_index integer,
  studied_at timestamptz,
  share_topic boolean not null default false,
  check ((course_id is null and lesson_index is null and studied_at is null) or
         (course_id is not null and lesson_index is not null and lesson_index >= 0 and studied_at is not null))
);
alter table mathuni_activity.students enable row level security;

revoke all on all tables in schema mathuni_activity from public, anon, authenticated;

create function mathuni_activity.record_visit(p_guest uuid)
returns void language plpgsql security definer set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  today date := (now() at time zone 'UTC')::date;
begin
  if coalesce(uid, p_guest) is null then return; end if;
  insert into mathuni_activity.visitors (is_guest, visitor_id, seen_on)
    values (uid is null, coalesce(uid, p_guest), today)
  on conflict (is_guest, visitor_id) do update set seen_on = excluded.seen_on
    where mathuni_activity.visitors.seen_on < excluded.seen_on;
end;
$$;

create function mathuni_activity.record_topic(p_course text, p_lesson integer)
returns void language plpgsql security definer set search_path = ''
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then raise exception 'sign-in required' using errcode = '42501'; end if;
  if p_lesson is null or p_lesson < 0 or not exists (
    select 1 from public.course_catalog c where c.course_id = p_course and p_lesson < c.lesson_count
  ) then
    raise exception 'invalid lesson' using errcode = '22023';
  end if;
  insert into mathuni_activity.students (user_id, course_id, lesson_index, studied_at)
    values (uid, p_course, p_lesson, now())
  on conflict (user_id) do update
    set course_id = excluded.course_id, lesson_index = excluded.lesson_index, studied_at = excluded.studied_at
    where mathuni_activity.students.studied_at is null
      or mathuni_activity.students.studied_at < excluded.studied_at;
end;
$$;

create function mathuni_activity.set_sharing(p_enabled boolean)
returns void language plpgsql security definer set search_path = ''
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then raise exception 'sign-in required' using errcode = '42501'; end if;
  insert into mathuni_activity.students (user_id, share_topic) values (uid, coalesce(p_enabled, false))
  on conflict (user_id) do update set share_topic = excluded.share_topic;
end;
$$;

create function mathuni_activity.summary()
returns jsonb language sql stable security definer set search_path = ''
as $$
  with settings as (
    select auth.uid() as uid, (now() at time zone 'UTC')::date - 6 as since
  ), visits as (
    select count(*) filter (where not v.is_guest) as accounts,
           count(*) filter (where v.is_guest) as guests
    from mathuni_activity.visitors v cross join settings s where v.seen_on >= s.since
  ), learners as (
    select a.user_id from mathuni_activity.students a cross join settings s
      where a.studied_at >= (s.since::timestamp at time zone 'UTC')
    union
    select l.user_id from public.lesson_progress l cross join settings s
      where l.completed and l.updated_at >= (s.since::timestamp at time zone 'UTC')
    union
    select q.user_id from public.quiz_attempts q cross join settings s
      where q.created_at >= (s.since::timestamp at time zone 'UTC')
  ), ranked as (
    select p.id, p.username, p.xp, rank() over (order by p.xp desc) as rank
    from public.profiles p
    where p.xp > 0 or p.id = (select uid from settings)
  ), top as (
    select r.* from ranked r order by r.rank, r.username limit 20
  ), displayed as (
    select * from top
    union all
    select r.* from ranked r cross join settings s
      where r.id = s.uid and not exists (select 1 from top t where t.id = r.id)
  ), rows as (
    select d.rank, d.username, d.xp, coalesce(d.id = s.uid, false) as is_me,
           (select count(*) from public.lesson_progress l where l.user_id = d.id and l.completed) as completed,
           case when d.id = s.uid or (s.uid is not null and a.share_topic) then a.course_id end as course_id,
           case when d.id = s.uid or (s.uid is not null and a.share_topic) then a.lesson_index end as lesson_index
    from displayed d cross join settings s left join mathuni_activity.students a on a.user_id = d.id
  )
  select jsonb_build_object(
    'accounts', visits.accounts,
    'guests', visits.guests,
    'learners', (select count(*) from learners),
    'share_topic', coalesce((select a.share_topic from mathuni_activity.students a where a.user_id = s.uid), false),
    'leaders', coalesce((select jsonb_agg(to_jsonb(r) order by r.rank, r.username) from rows r), '[]'::jsonb)
  )
  from visits cross join settings s;
$$;

-- The Data API only exposes invoker wrappers. Elevated helpers live in the private schema.
create function public.record_site_visit(p_guest uuid default null)
returns void language sql security invoker set search_path = ''
as $$ select mathuni_activity.record_visit(p_guest); $$;

create function public.record_study_topic(p_course text, p_lesson integer)
returns void language sql security invoker set search_path = ''
as $$ select mathuni_activity.record_topic(p_course, p_lesson); $$;

create function public.set_topic_sharing(p_enabled boolean)
returns void language sql security invoker set search_path = ''
as $$ select mathuni_activity.set_sharing(p_enabled); $$;

create function public.community_activity()
returns jsonb language sql stable security invoker set search_path = ''
as $$ select mathuni_activity.summary(); $$;

revoke execute on all functions in schema mathuni_activity from public, anon, authenticated;
revoke execute on function public.record_site_visit(uuid), public.record_study_topic(text, integer),
  public.set_topic_sharing(boolean), public.community_activity() from public, anon, authenticated;
grant execute on function mathuni_activity.record_visit(uuid), mathuni_activity.summary(),
  public.record_site_visit(uuid), public.community_activity() to anon, authenticated;
grant execute on function mathuni_activity.record_topic(text, integer), mathuni_activity.set_sharing(boolean),
  public.record_study_topic(text, integer), public.set_topic_sharing(boolean) to authenticated;

commit;
