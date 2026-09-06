-- Replay community: profiles, posts, media, likes, comments
create table if not exists profiles (
  user_id text primary key,
  handle text not null unique,
  display_name text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists posts (
  id serial primary key,
  user_id text not null,
  body text not null,
  game_tag text,
  created_at timestamptz not null default now()
);
create index if not exists posts_created_at_idx on posts (created_at desc);
create index if not exists posts_user_id_idx on posts (user_id);

create table if not exists post_media (
  id serial primary key,
  post_id integer not null references posts(id) on delete cascade,
  kind text not null check (kind in ('image', 'video')),
  mime text not null,
  public_path text,
  data_b64 text
);
create index if not exists post_media_post_id_idx on post_media (post_id);

create table if not exists likes (
  post_id integer not null references posts(id) on delete cascade,
  user_id text not null,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table if not exists comments (
  id serial primary key,
  post_id integer not null references posts(id) on delete cascade,
  user_id text not null,
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists comments_post_id_idx on comments (post_id);
