begin;

-- One row per visitor and active minute. Several open tabs share a minute, so time is never double counted.
create table mathuni_activity.minutes (
  is_guest boolean not null,
  visitor_id uuid not null,
  minute timestamptz not null,
  screen text not null,
  study boolean not null,
  course_id text references public.course_catalog(course_id) on delete set null,
  lesson_index integer,
  primary key (is_guest, visitor_id, minute)
);
alter table mathuni_activity.minutes enable row level security;
create index activity_minutes_minute_idx on mathuni_activity.minutes (minute);

-- Latest heartbeat of each open browser. A visitor is online while the heartbeat is fresh.
create table mathuni_activity.presence (
  is_guest boolean not null,
  visitor_id uuid not null,
  last_seen timestamptz not null,
  since timestamptz not null,
  active boolean not null,
  screen text not null,
  study boolean not null,
  course_id text references public.course_catalog(course_id) on delete set null,
  lesson_index integer,
  primary key (is_guest, visitor_id)
);
alter table mathuni_activity.presence enable row level security;
create index activity_presence_seen_idx on mathuni_activity.presence (last_seen);

-- Learners appear in the online list and the study-time ranking unless they opt out.
alter table mathuni_activity.students add column show_online boolean not null default true;

revoke all on all tables in schema mathuni_activity from public, anon, authenticated;

create function mathuni_activity.screen_ok(p_screen text)
returns boolean language sql immutable set search_path = ''
as $$
  select p_screen in ('home', 'courses', 'lesson', 'math1', 'calc', 'plot', 'quiz', 'activity', 'notes', 'hacks', 'bonus');
$$;

-- Unknown time zone names fall back to UTC. Converting is much cheaper than scanning pg_timezone_names.
create function mathuni_activity.safe_tz(p_tz text)
returns text language plpgsql stable set search_path = ''
as $$
begin
  if p_tz is null or length(p_tz) > 64 then return 'UTC'; end if;
  perform now() at time zone p_tz;
  return p_tz;
exception when others then
  return 'UTC';
end;
$$;

create function mathuni_activity.online()
returns jsonb language sql stable security definer set search_path = ''
as $$
  with me as (
    select auth.uid() as uid
  ), live as (
    select p.* from mathuni_activity.presence p where p.last_seen > now() - interval '90 seconds'
  ), people as (
    select pr.username, p.active, p.screen, p.study, p.since, p.visitor_id = m.uid as is_me,
           case when p.visitor_id = m.uid or coalesce(s.share_topic, false) then p.course_id end as course_id,
           case when p.visitor_id = m.uid or coalesce(s.share_topic, false) then p.lesson_index end as lesson_index
    from live p
    cross join me m
    join public.profiles pr on pr.id = p.visitor_id
    left join mathuni_activity.students s on s.user_id = p.visitor_id
    where not p.is_guest and m.uid is not null
      and (p.visitor_id = m.uid or coalesce(s.show_online, true))
    order by (p.visitor_id = m.uid) desc, p.active desc, p.study desc, p.since
    limit 60
  )
  select jsonb_build_object(
    'online', (select count(*) from live),
    'active', (select count(*) from live where active),
    'studying', (select count(*) from live where active and study),
    'accounts', (select count(*) from live where not is_guest),
    'guests', (select count(*) from live where is_guest),
    'show_online', coalesce((select s.show_online from mathuni_activity.students s, me where s.user_id = me.uid), true),
    'people', coalesce((select jsonb_agg(to_jsonb(x) order by x.is_me desc, x.active desc, x.study desc, x.since) from people x), '[]'::jsonb)
  );
$$;

create function mathuni_activity.ping(
  p_guest uuid, p_screen text, p_course text, p_lesson integer, p_active boolean, p_visible boolean
)
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_guest boolean := v_uid is null;
  v_vid uuid := coalesce(v_uid, p_guest);
  v_study boolean;
  v_course text := p_course;
  v_lesson integer := p_lesson;
begin
  if v_vid is null then return mathuni_activity.online(); end if;
  if not mathuni_activity.screen_ok(p_screen) then
    raise exception 'invalid screen' using errcode = '22023';
  end if;
  if v_course is null or v_lesson is null or v_lesson < 0 or not exists (
    select 1 from public.course_catalog c where c.course_id = v_course and v_lesson < c.lesson_count
  ) then
    v_course := null;
    v_lesson := null;
  end if;
  v_study := v_lesson is not null or p_screen in ('lesson', 'math1', 'quiz');

  insert into mathuni_activity.visitors (is_guest, visitor_id, seen_on)
    values (v_guest, v_vid, (now() at time zone 'UTC')::date)
  on conflict (is_guest, visitor_id) do update set seen_on = excluded.seen_on
    where mathuni_activity.visitors.seen_on < excluded.seen_on;

  if coalesce(p_visible, false) then
    insert into mathuni_activity.presence as p
      (is_guest, visitor_id, last_seen, since, active, screen, study, course_id, lesson_index)
    values (v_guest, v_vid, now(), now(), coalesce(p_active, false), p_screen, v_study, v_course, v_lesson)
    on conflict (is_guest, visitor_id) do update set
      last_seen = excluded.last_seen,
      since = case when p.last_seen < now() - interval '5 minutes' then excluded.since else p.since end,
      active = excluded.active, screen = excluded.screen, study = excluded.study,
      course_id = excluded.course_id, lesson_index = excluded.lesson_index;
  end if;
  -- A hidden tab leaves presence alone: another visible tab of the same visitor may still be open.

  if coalesce(p_active, false) and coalesce(p_visible, false) then
    insert into mathuni_activity.minutes as m
      (is_guest, visitor_id, minute, screen, study, course_id, lesson_index)
    values (v_guest, v_vid, date_trunc('minute', now()), p_screen, v_study, v_course, v_lesson)
    on conflict (is_guest, visitor_id, minute) do update set
      screen = case when excluded.study and not m.study then excluded.screen else m.screen end,
      course_id = case when excluded.study and not m.study then excluded.course_id else coalesce(m.course_id, excluded.course_id) end,
      lesson_index = case when excluded.study and not m.study then excluded.lesson_index else coalesce(m.lesson_index, excluded.lesson_index) end,
      study = m.study or excluded.study;
  end if;

  -- Occasional housekeeping keeps both tables small without a scheduler.
  if random() < 0.002 then
    delete from mathuni_activity.presence where last_seen < now() - interval '1 day';
    delete from mathuni_activity.minutes where minute < now() - interval '400 days';
  end if;

  return mathuni_activity.online();
end;
$$;

create function mathuni_activity.my_time(p_guest uuid, p_tz text, p_start date)
returns jsonb language sql stable security definer set search_path = ''
as $$
  with settings as (
    select auth.uid() is null as guest, coalesce(auth.uid(), p_guest) as vid,
           mathuni_activity.safe_tz(p_tz) as tz,
           coalesce(p_start, (now() at time zone mathuni_activity.safe_tz(p_tz))::date - 6) as day0
  ), bounds as (
    select s.*, (s.day0::timestamp at time zone s.tz) as t0, ((s.day0 + 7)::timestamp at time zone s.tz) as t1,
           ((s.day0 - 7)::timestamp at time zone s.tz) as prev0
    from settings s
  ), rows as (
    select m.*, (m.minute at time zone b.tz) as local_time, b.day0
    from mathuni_activity.minutes m cross join bounds b
    where b.vid is not null and m.is_guest = b.guest and m.visitor_id = b.vid
      and m.minute >= b.t0 and m.minute < b.t1
  ), prev as (
    select count(*) as total, count(*) filter (where m.study) as study
    from mathuni_activity.minutes m cross join bounds b
    where b.vid is not null and m.is_guest = b.guest and m.visitor_id = b.vid
      and m.minute >= b.prev0 and m.minute < b.t0
  ), days as (
    select d.n, count(r.minute) as total, count(r.minute) filter (where r.study) as study
    from generate_series(0, 6) d(n)
    left join rows r on r.local_time::date = r.day0 + d.n
    group by d.n
  ), hours as (
    select h.n, count(r.minute) as total
    from generate_series(0, 23) h(n)
    left join rows r on extract(hour from r.local_time) = h.n
    group by h.n
  ), screens as (
    select r.screen, count(*) as minutes, count(*) filter (where r.study) as study
    from rows r group by r.screen
  ), courses as (
    select r.course_id, count(*) as minutes
    from rows r where r.course_id is not null group by r.course_id
  ), lessons as (
    select r.course_id, r.lesson_index, count(*) as minutes
    from rows r where r.course_id is not null group by r.course_id, r.lesson_index
    order by minutes desc, r.course_id, r.lesson_index limit 6
  )
  select jsonb_build_object(
    'start', (select day0 from settings),
    'tz', (select tz from settings),
    'total', (select count(*) from rows),
    'study', (select count(*) from rows where study),
    'prev_total', (select total from prev),
    'prev_study', (select study from prev),
    'days', (select jsonb_agg(jsonb_build_object('total', total, 'study', study) order by n) from days),
    'hours', (select jsonb_agg(total order by n) from hours),
    'screens', coalesce((select jsonb_agg(to_jsonb(s) order by s.minutes desc) from screens s), '[]'::jsonb),
    'courses', coalesce((select jsonb_agg(to_jsonb(c) order by c.minutes desc) from courses c), '[]'::jsonb),
    'lessons', coalesce((select jsonb_agg(to_jsonb(l) order by l.minutes desc) from lessons l), '[]'::jsonb)
  );
$$;

create function mathuni_activity.time_ranking()
returns jsonb language sql stable security definer set search_path = ''
as $$
  with me as (
    select auth.uid() as uid
  ), week as (
    select m.visitor_id, count(*) as total, count(*) filter (where m.study) as study
    from mathuni_activity.minutes m
    where not m.is_guest and m.minute >= now() - interval '7 days'
    group by m.visitor_id
  ), visible as (
    select w.*, p.username, w.visitor_id = me.uid as is_me
    from week w cross join me
    join public.profiles p on p.id = w.visitor_id
    left join mathuni_activity.students s on s.user_id = w.visitor_id
    where me.uid is not null and (w.visitor_id = me.uid or coalesce(s.show_online, true))
  ), ranked as (
    select v.*, rank() over (order by v.study desc, v.total desc) as rank from visible v
  ), shown as (
    select * from (select * from ranked order by rank, username limit 20) top
    union
    select * from ranked where is_me
  )
  select jsonb_build_object(
    'study', (select coalesce(sum(study), 0) from week),
    'total', (select coalesce(sum(total), 0) from week),
    'learners', (select count(*) from week where study > 0),
    'leaders', coalesce((select jsonb_agg(jsonb_build_object(
        'rank', rank, 'username', username, 'study', study, 'total', total, 'is_me', is_me
      ) order by rank, username) from shown), '[]'::jsonb)
  );
$$;

create function mathuni_activity.set_online_visibility(p_enabled boolean)
returns void language plpgsql security definer set search_path = ''
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then raise exception 'sign-in required' using errcode = '42501'; end if;
  insert into mathuni_activity.students (user_id, show_online) values (uid, coalesce(p_enabled, true))
  on conflict (user_id) do update set show_online = excluded.show_online;
end;
$$;

create function public.activity_ping(
  p_guest uuid default null, p_screen text default 'home', p_course text default null,
  p_lesson integer default null, p_active boolean default true, p_visible boolean default true
)
returns jsonb language sql security invoker set search_path = ''
as $$ select mathuni_activity.ping(p_guest, p_screen, p_course, p_lesson, p_active, p_visible); $$;

create function public.online_now()
returns jsonb language sql stable security invoker set search_path = ''
as $$ select mathuni_activity.online(); $$;

create function public.my_study_time(p_guest uuid default null, p_tz text default 'UTC', p_start date default null)
returns jsonb language sql stable security invoker set search_path = ''
as $$ select mathuni_activity.my_time(p_guest, p_tz, p_start); $$;

create function public.study_time_ranking()
returns jsonb language sql stable security invoker set search_path = ''
as $$ select mathuni_activity.time_ranking(); $$;

create function public.set_online_visibility(p_enabled boolean)
returns void language sql security invoker set search_path = ''
as $$ select mathuni_activity.set_online_visibility(p_enabled); $$;

revoke execute on function mathuni_activity.screen_ok(text), mathuni_activity.safe_tz(text),
  mathuni_activity.online(), mathuni_activity.ping(uuid, text, text, integer, boolean, boolean),
  mathuni_activity.my_time(uuid, text, date), mathuni_activity.time_ranking(),
  mathuni_activity.set_online_visibility(boolean),
  public.activity_ping(uuid, text, text, integer, boolean, boolean), public.online_now(),
  public.my_study_time(uuid, text, date), public.study_time_ranking(), public.set_online_visibility(boolean)
  from public, anon, authenticated;

grant execute on function mathuni_activity.screen_ok(text), mathuni_activity.safe_tz(text),
  mathuni_activity.online(), mathuni_activity.ping(uuid, text, text, integer, boolean, boolean),
  mathuni_activity.my_time(uuid, text, date), mathuni_activity.time_ranking(),
  public.activity_ping(uuid, text, text, integer, boolean, boolean), public.online_now(),
  public.my_study_time(uuid, text, date), public.study_time_ranking()
  to anon, authenticated;
grant execute on function mathuni_activity.set_online_visibility(boolean), public.set_online_visibility(boolean)
  to authenticated;

commit;
