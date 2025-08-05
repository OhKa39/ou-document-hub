create table if not exists comments_likes
(
  comment_id UUID not null,
  user_id    UUID not null,
  primary key (comment_id, user_id),
  foreign key (comment_id) references comments (comment_id),
  foreign key (user_id) references users (user_id)
);

ALTER TABLE  comments
  ADD COLUMN if not exists rating int;

ALTER TABLE  comments
  ADD COLUMN if not exists likes int;
