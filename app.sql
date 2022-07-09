-- create user table with username email and passowrd postgresql
CREATE TABLE IF NOT EXISTS users (
  id serial PRIMARY KEY,
  username varchar(255) NOT NULL,
  email varchar(255) NOT NULL unique,
  password varchar(255) NOT NULL,
  oncreated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
);
-- Given on express-session website
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

-- create a table post with content and user_id refering to the user table
CREATE TABLE IF NOT EXISTS posts (
  id serial PRIMARY KEY,
  content text NOT NULL,
  user_id int NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  oncreate timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP

);


-- comment tabel refring to the post table and user table delete on cascade
CREATE TABLE IF NOT EXISTS comments (
  id serial PRIMARY KEY,
  content text NOT NULL,
  user_id int NOT NULL,
  post_id int NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  oncreate timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--  alter comment tabel Foreign key to user table and post table delete on cascade
ALTER TABLE comments
  ADD CONSTRAINT comments_user_id_foreign FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
-- insert into comment table
INSERT INTO comments (content, user_id, post_id) VALUES ('this is a comment', 1, 1);
