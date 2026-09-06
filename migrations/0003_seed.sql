insert into profiles (user_id, handle, display_name)
values ('seed-replay', 'replay', 'Replay')
on conflict (user_id) do nothing;

insert into posts (id, user_id, body, game_tag, created_at)
values
  (
    1,
    'seed-replay',
    'La cittadella sopra la nebbia. Tre ore per arrivarci a piedi, zero checkpoint, una vista che vale il run intero. Qualcuno l’ha già vista di notte?',
    'Souls-like',
    now() - interval '2 days'
  ),
  (
    2,
    'seed-replay',
    'Highway 7, golden hour. Ho spento l’HUD e ho guidato in silenzio per venti minuti. A volte il gioco migliore è quello che non ti chiede niente.',
    'Racing',
    now() - interval '18 hours'
  ),
  (
    3,
    'seed-replay',
    'Serra abbandonata nel DLC botanico. Il suono dei vetri e il dust in controluce — se cercate un posto per foto, è questo.',
    'Esplorazione',
    now() - interval '6 hours'
  ),
  (
    4,
    'seed-replay',
    'Sala sommersa, capitolo finale. Niente combattimento, solo nuoto lento tra le colonne. Mi è rimasta in testa più di qualsiasi boss.',
    'Avventura',
    now() - interval '50 minutes'
  )
on conflict (id) do nothing;

select setval('posts_id_seq', (select coalesce(max(id), 1) from posts));

insert into post_media (post_id, kind, mime, public_path)
select 1, 'image', 'image/jpeg', '/seed/citadel.jpg'
where not exists (select 1 from post_media where post_id = 1);

insert into post_media (post_id, kind, mime, public_path)
select 2, 'image', 'image/jpeg', '/seed/highway.jpg'
where not exists (select 1 from post_media where post_id = 2);

insert into post_media (post_id, kind, mime, public_path)
select 3, 'image', 'image/jpeg', '/seed/glasshouse.jpg'
where not exists (select 1 from post_media where post_id = 3);

insert into post_media (post_id, kind, mime, public_path)
select 4, 'image', 'image/jpeg', '/seed/marble.jpg'
where not exists (select 1 from post_media where post_id = 4);

insert into comments (post_id, user_id, body, created_at)
select 1, 'seed-replay', 'Di notte la nebbia si alza e si vedono le torce sulla rampa est. Portate una torcia lunga.', now() - interval '1 day'
where not exists (select 1 from comments where post_id = 1);
