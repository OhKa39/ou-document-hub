create table if not exists comment_images(
  image_id UUID not null primary key, 
  comment_id UUID not null,
  image_url varchar(255) not null,
  created_at timestamp not null,
  foreign key (comment_id) references comments (comment_id)

);
