begin;

-- Teacher cabinet: teachers create study groups, students join with an invite code and can leave at any time.
-- The site owner marks teachers in the SQL editor; nothing on the site can make someone a teacher:
--   select mathuni_teaching.set_teacher('teacher@example.com', true, 'Марданова Л.О.');
--   select mathuni_teaching.set_teacher('teacher@example.com', false);
create schema if not exists mathuni_teaching;
revoke all on schema mathuni_teaching from public, anon, authenticated;
grant usage on schema mathuni_teaching to authenticated;

-- A row here is the teacher flag. Removing it hides the teacher's groups without deleting them.
create table mathuni_teaching.teachers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  -- Set by the owner and shown to students on the join screen instead of the username.
  display_name text check (display_name is null or char_length(display_name) between 1 and 80),
  added_at timestamptz not null default now()
);

create table mathuni_teaching.groups (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  course_id text not null references public.course_catalog(course_id),
  code text not null unique check (code ~ '^[A-HJKMNP-Z2-9]{8}$'),
  created_at timestamptz not null default now()
);
create index teaching_groups_teacher_idx on mathuni_teaching.groups (teacher_id, created_at);
create index teaching_groups_course_idx on mathuni_teaching.groups (course_id);

create table mathuni_teaching.members (
  group_id uuid not null references mathuni_teaching.groups(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  -- The name the student chose for this group's teacher.
  display_name text not null check (char_length(display_name) between 1 and 80),
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);
create index teaching_members_user_idx on mathuni_teaching.members (user_id);

alter table mathuni_teaching.teachers enable row level security;
alter table mathuni_teaching.groups enable row level security;
alter table mathuni_teaching.members enable row level security;
revoke all on all tables in schema mathuni_teaching from public, anon, authenticated;

-- Group reports read every quiz attempt of each member.
create index if not exists quiz_attempts_user_created_idx on public.quiz_attempts (user_id, created_at desc);

-- ───────────── Helpers (run inside the definer functions only) ─────────────

-- Collapses spaces and control characters; empty text becomes null.
create function mathuni_teaching.clean_text(p_text text)
returns text language sql immutable set search_path = ''
as $$
  select nullif(btrim(regexp_replace(coalesce(p_text, ''), '[[:space:][:cntrl:]]+', ' ', 'g')), '');
$$;

-- "abcd-efgh" → "ABCDEFGH"; anything that cannot be a code becomes null.
create function mathuni_teaching.clean_code(p_code text)
returns text language sql immutable set search_path = ''
as $$
  select c from (select upper(regexp_replace(coalesce(p_code, ''), '[^A-Za-z0-9]', '', 'g')) as c) x
  where c ~ '^[A-HJKMNP-Z2-9]{8}$';
$$;

-- 8 characters without look-alikes (no 0/O, 1/I/L), from the random bytes of a v4 UUID.
create function mathuni_teaching.new_code()
returns text language plpgsql volatile set search_path = ''
as $$
declare
  v_alphabet constant text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  v_bytes bytea := uuid_send(gen_random_uuid());
  v_code text := '';
  v_pos integer;
begin
  -- Bytes 6 and 8 carry the UUID version and variant bits.
  foreach v_pos in array array[0, 1, 2, 3, 4, 5, 7, 9] loop
    v_code := v_code || substr(v_alphabet, 1 + get_byte(v_bytes, v_pos) % 31, 1);
  end loop;
  return v_code;
end;
$$;

create function mathuni_teaching.is_teacher(p_uid uuid)
returns boolean language sql stable set search_path = ''
as $$ select exists (select 1 from mathuni_teaching.teachers t where t.user_id = p_uid); $$;

-- The caller's own group, or an error. Every teacher action starts here.
create function mathuni_teaching.own_group(p_group uuid)
returns mathuni_teaching.groups language plpgsql stable set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_group mathuni_teaching.groups;
begin
  if v_uid is null then raise exception 'sign-in required' using errcode = '42501'; end if;
  if not mathuni_teaching.is_teacher(v_uid) then raise exception 'teacher only' using errcode = '42501'; end if;
  select g.* into v_group from mathuni_teaching.groups g where g.id = p_group and g.teacher_id = v_uid;
  if not found then raise exception 'group not found' using errcode = 'P0002'; end if;
  return v_group;
end;
$$;

-- ───────────── Owner only (SQL editor) ─────────────

create function mathuni_teaching.set_teacher(p_email text, p_teacher boolean default true, p_display_name text default null)
returns text language plpgsql set search_path = ''
as $$
declare
  v_uid uuid;
  v_name text := mathuni_teaching.clean_text(p_display_name);
begin
  select u.id into v_uid from auth.users u where lower(u.email) = lower(btrim(p_email));
  if v_uid is null then raise exception 'no account with e-mail %', p_email using errcode = 'P0002'; end if;
  if not coalesce(p_teacher, true) then
    delete from mathuni_teaching.teachers t where t.user_id = v_uid;
    return format('%s is no longer a teacher; their groups are kept but hidden', p_email);
  end if;
  if char_length(v_name) > 80 then raise exception 'display name is longer than 80 characters' using errcode = '22023'; end if;
  insert into mathuni_teaching.teachers as t (user_id, display_name) values (v_uid, v_name)
  on conflict (user_id) do update set display_name = coalesce(excluded.display_name, t.display_name);
  return format('%s is a teacher', p_email);
end;
$$;

-- ───────────── Everyone signed in ─────────────

create function mathuni_teaching.my_groups()
returns jsonb language sql stable security definer set search_path = ''
as $$
  with me as (
    select auth.uid() as uid, mathuni_teaching.is_teacher(auth.uid()) as teacher
  )
  select jsonb_build_object(
    'teacher', coalesce(me.teacher, false),
    'memberships', coalesce((
      select jsonb_agg(jsonb_build_object(
          'id', g.id, 'name', g.name, 'course_id', g.course_id,
          'teacher', coalesce(t.display_name, p.username),
          'display_name', m.display_name, 'joined_at', m.joined_at
        ) order by m.joined_at desc)
      from mathuni_teaching.members m
      join mathuni_teaching.groups g on g.id = m.group_id
      left join mathuni_teaching.teachers t on t.user_id = g.teacher_id
      left join public.profiles p on p.id = g.teacher_id
      where m.user_id = me.uid
    ), '[]'::jsonb),
    'groups', case when me.teacher then coalesce((
      select jsonb_agg(jsonb_build_object(
          'id', g.id, 'name', g.name, 'course_id', g.course_id, 'code', g.code, 'created_at', g.created_at,
          'members', (select count(*) from mathuni_teaching.members m where m.group_id = g.id)
        ) order by g.created_at)
      from mathuni_teaching.groups g
      where g.teacher_id = me.uid
    ), '[]'::jsonb) else '[]'::jsonb end
  )
  from me;
$$;

-- What a student sees before joining. Null when the code matches no open group.
create function mathuni_teaching.preview(p_code text)
returns jsonb language plpgsql stable security definer set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then raise exception 'sign-in required' using errcode = '42501'; end if;
  return (
    select jsonb_build_object(
      'name', g.name, 'course_id', g.course_id, 'code', g.code,
      'teacher', coalesce(t.display_name, p.username),
      'own', g.teacher_id = v_uid,
      'member', m.user_id is not null,
      'display_name', coalesce(m.display_name, me.username)
    )
    from mathuni_teaching.groups g
    join mathuni_teaching.teachers t on t.user_id = g.teacher_id
    left join public.profiles p on p.id = g.teacher_id
    left join mathuni_teaching.members m on m.group_id = g.id and m.user_id = v_uid
    left join public.profiles me on me.id = v_uid
    where g.code = mathuni_teaching.clean_code(p_code)
  );
end;
$$;

-- Joining again with the same code only changes the name shown to the teacher.
create function mathuni_teaching.join_group(p_code text, p_name text)
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_name text := mathuni_teaching.clean_text(p_name);
  v_group mathuni_teaching.groups;
begin
  if v_uid is null then raise exception 'sign-in required' using errcode = '42501'; end if;
  if v_name is null then
    select p.username into v_name from public.profiles p where p.id = v_uid;
  end if;
  if v_name is null or char_length(v_name) > 80 then raise exception 'invalid name' using errcode = '22023'; end if;
  -- The row lock makes concurrent joins wait, so the size limit holds.
  select g.* into v_group from mathuni_teaching.groups g
  where g.code = mathuni_teaching.clean_code(p_code)
    and exists (select 1 from mathuni_teaching.teachers t where t.user_id = g.teacher_id)
  for update;
  if not found then raise exception 'code not found' using errcode = 'P0002'; end if;
  if v_group.teacher_id = v_uid then raise exception 'own group' using errcode = '22023'; end if;
  if not exists (select 1 from mathuni_teaching.members m where m.group_id = v_group.id and m.user_id = v_uid)
     and (select count(*) from mathuni_teaching.members m where m.group_id = v_group.id) >= 500 then
    raise exception 'group is full' using errcode = '54000';
  end if;
  insert into mathuni_teaching.members as m (group_id, user_id, display_name)
  values (v_group.id, v_uid, v_name)
  on conflict (group_id, user_id) do update set display_name = excluded.display_name;
  return mathuni_teaching.my_groups();
end;
$$;

create function mathuni_teaching.leave_group(p_group uuid)
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then raise exception 'sign-in required' using errcode = '42501'; end if;
  delete from mathuni_teaching.members m where m.group_id = p_group and m.user_id = v_uid;
  return mathuni_teaching.my_groups();
end;
$$;

-- ───────────── Teachers ─────────────

create function mathuni_teaching.create_group(p_name text, p_course text)
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_name text := mathuni_teaching.clean_text(p_name);
  v_id uuid;
  v_try integer := 0;
begin
  if v_uid is null then raise exception 'sign-in required' using errcode = '42501'; end if;
  if not mathuni_teaching.is_teacher(v_uid) then raise exception 'teacher only' using errcode = '42501'; end if;
  if v_name is null or char_length(v_name) > 80 then raise exception 'invalid name' using errcode = '22023'; end if;
  if not exists (select 1 from public.course_catalog c where c.course_id = p_course) then
    raise exception 'invalid course' using errcode = '22023';
  end if;
  perform 1 from mathuni_teaching.teachers t where t.user_id = v_uid for update;
  if (select count(*) from mathuni_teaching.groups g where g.teacher_id = v_uid) >= 100 then
    raise exception 'too many groups' using errcode = '54000';
  end if;
  loop
    v_try := v_try + 1;
    insert into mathuni_teaching.groups (teacher_id, name, course_id, code)
    values (v_uid, v_name, p_course, mathuni_teaching.new_code())
    on conflict (code) do nothing
    returning id into v_id;
    exit when v_id is not null;
    if v_try >= 10 then raise exception 'could not create a unique code'; end if;
  end loop;
  return mathuni_teaching.my_groups() || jsonb_build_object('created', v_id);
end;
$$;

create function mathuni_teaching.rename_group(p_group uuid, p_name text)
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare
  v_group mathuni_teaching.groups := mathuni_teaching.own_group(p_group);
  v_name text := mathuni_teaching.clean_text(p_name);
begin
  if v_name is null or char_length(v_name) > 80 then raise exception 'invalid name' using errcode = '22023'; end if;
  update mathuni_teaching.groups g set name = v_name where g.id = v_group.id;
  return mathuni_teaching.my_groups();
end;
$$;

-- A new code stops the old one from working; current members stay.
create function mathuni_teaching.renew_code(p_group uuid)
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare
  v_group mathuni_teaching.groups := mathuni_teaching.own_group(p_group);
  v_try integer := 0;
begin
  loop
    v_try := v_try + 1;
    begin
      update mathuni_teaching.groups g set code = mathuni_teaching.new_code() where g.id = v_group.id;
      exit;
    exception when unique_violation then
      if v_try >= 10 then raise; end if;
    end;
  end loop;
  return mathuni_teaching.my_groups();
end;
$$;

create function mathuni_teaching.delete_group(p_group uuid)
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare
  v_group mathuni_teaching.groups := mathuni_teaching.own_group(p_group);
begin
  delete from mathuni_teaching.groups g where g.id = v_group.id;
  return mathuni_teaching.my_groups();
end;
$$;

create function mathuni_teaching.remove_member(p_group uuid, p_user uuid)
returns void language plpgsql security definer set search_path = ''
as $$
declare
  v_group mathuni_teaching.groups := mathuni_teaching.own_group(p_group);
begin
  delete from mathuni_teaching.members m where m.group_id = v_group.id and m.user_id = p_user;
end;
$$;

-- One row per member: completed lessons of the group's course, all quiz attempts,
-- study, course and total site minutes for the last 7 and 30 days, and the last active time.
create function mathuni_teaching.report(p_group uuid)
returns jsonb language plpgsql stable security definer set search_path = ''
as $$
declare
  v_group mathuni_teaching.groups := mathuni_teaching.own_group(p_group);
  v_lessons integer;
begin
  select c.lesson_count into v_lessons from public.course_catalog c where c.course_id = v_group.course_id;
  return jsonb_build_object(
    'group', jsonb_build_object(
      'id', v_group.id, 'name', v_group.name, 'course_id', v_group.course_id, 'code', v_group.code,
      'created_at', v_group.created_at, 'lesson_count', v_lessons),
    'generated_at', now(),
    'students', coalesce((
      select jsonb_agg(jsonb_build_object(
          'user_id', m.user_id,
          'name', m.display_name,
          'username', p.username,
          'joined_at', m.joined_at,
          'lessons', lp.lessons,
          'quiz_attempts', q.attempts,
          'quiz_score', q.score,
          'quiz_total', q.total,
          'quiz_best', q.best,
          'quiz_last', q.last_at,
          'study_7', t.study_7, 'course_7', t.course_7, 'total_7', t.total_7,
          'study_30', t.study_30, 'course_30', t.course_30, 'total_30', t.total_30,
          'last_active', greatest(lm.last_minute, p.last_active, lp.last_at, q.last_at)
        ) order by m.display_name, m.user_id)
      from mathuni_teaching.members m
      left join public.profiles p on p.id = m.user_id
      cross join lateral (
        select coalesce(jsonb_agg(l.lesson_index order by l.lesson_index), '[]'::jsonb) as lessons,
               max(l.updated_at) as last_at
        from public.lesson_progress l
        where l.user_id = m.user_id and l.course_id = v_group.course_id and l.completed
          and l.lesson_index >= 0 and l.lesson_index < v_lessons
      ) lp
      cross join lateral (
        select count(*) as attempts, coalesce(sum(a.score), 0) as score, coalesce(sum(a.total), 0) as total,
               max(round(100.0 * a.score / a.total)::integer) as best, max(a.created_at) as last_at
        from public.quiz_attempts a
        where a.user_id = m.user_id and a.total > 0
      ) q
      cross join lateral (
        -- Mathematics 1 has its own section: every minute there belongs to the course,
        -- including video, trainer and variants, which carry no lesson.
        select count(*) filter (where x.minute >= now() - interval '7 days') as total_7,
               count(*) filter (where x.study and x.minute >= now() - interval '7 days') as study_7,
               count(*) filter (where x.minute >= now() - interval '7 days' and (x.course_id = v_group.course_id
                 or (v_group.course_id = 'math1' and x.screen = 'math1'))) as course_7,
               count(*) as total_30,
               count(*) filter (where x.study) as study_30,
               count(*) filter (where x.course_id = v_group.course_id
                 or (v_group.course_id = 'math1' and x.screen = 'math1')) as course_30
        from mathuni_activity.minutes x
        where not x.is_guest and x.visitor_id = m.user_id and x.minute >= now() - interval '30 days'
      ) t
      cross join lateral (
        select max(y.minute) as last_minute
        from mathuni_activity.minutes y
        where not y.is_guest and y.visitor_id = m.user_id
      ) lm
      where m.group_id = v_group.id
    ), '[]'::jsonb)
  );
end;
$$;

-- ───────────── Data API: invoker wrappers ─────────────

create function public.my_study_groups()
returns jsonb language sql stable security invoker set search_path = ''
as $$ select mathuni_teaching.my_groups(); $$;

create function public.preview_study_group(p_code text)
returns jsonb language sql stable security invoker set search_path = ''
as $$ select mathuni_teaching.preview(p_code); $$;

create function public.join_study_group(p_code text, p_name text default null)
returns jsonb language sql security invoker set search_path = ''
as $$ select mathuni_teaching.join_group(p_code, p_name); $$;

create function public.leave_study_group(p_group uuid)
returns jsonb language sql security invoker set search_path = ''
as $$ select mathuni_teaching.leave_group(p_group); $$;

create function public.create_study_group(p_name text, p_course text)
returns jsonb language sql security invoker set search_path = ''
as $$ select mathuni_teaching.create_group(p_name, p_course); $$;

create function public.rename_study_group(p_group uuid, p_name text)
returns jsonb language sql security invoker set search_path = ''
as $$ select mathuni_teaching.rename_group(p_group, p_name); $$;

create function public.renew_study_group_code(p_group uuid)
returns jsonb language sql security invoker set search_path = ''
as $$ select mathuni_teaching.renew_code(p_group); $$;

create function public.delete_study_group(p_group uuid)
returns jsonb language sql security invoker set search_path = ''
as $$ select mathuni_teaching.delete_group(p_group); $$;

create function public.remove_study_group_member(p_group uuid, p_user uuid)
returns void language sql security invoker set search_path = ''
as $$ select mathuni_teaching.remove_member(p_group, p_user); $$;

create function public.study_group_report(p_group uuid)
returns jsonb language sql stable security invoker set search_path = ''
as $$ select mathuni_teaching.report(p_group); $$;

revoke execute on all functions in schema mathuni_teaching from public, anon, authenticated;
revoke execute on function public.my_study_groups(), public.preview_study_group(text),
  public.join_study_group(text, text), public.leave_study_group(uuid), public.create_study_group(text, text),
  public.rename_study_group(uuid, text), public.renew_study_group_code(uuid), public.delete_study_group(uuid),
  public.remove_study_group_member(uuid, uuid), public.study_group_report(uuid)
  from public, anon, authenticated;

grant execute on function mathuni_teaching.my_groups(), mathuni_teaching.preview(text),
  mathuni_teaching.join_group(text, text), mathuni_teaching.leave_group(uuid),
  mathuni_teaching.create_group(text, text), mathuni_teaching.rename_group(uuid, text),
  mathuni_teaching.renew_code(uuid), mathuni_teaching.delete_group(uuid),
  mathuni_teaching.remove_member(uuid, uuid), mathuni_teaching.report(uuid),
  public.my_study_groups(), public.preview_study_group(text),
  public.join_study_group(text, text), public.leave_study_group(uuid), public.create_study_group(text, text),
  public.rename_study_group(uuid, text), public.renew_study_group_code(uuid), public.delete_study_group(uuid),
  public.remove_study_group_member(uuid, uuid), public.study_group_report(uuid)
  to authenticated;

commit;
