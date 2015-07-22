CREATE TABLE session (
  id integer PRIMARY KEY NOT NULL
);

CREATE TABLE session_data (
  session_id integer NOT NULL,
  "key" varchar(128) NOT NULL,
  val text,
  "indexed" varchar(1024),
  FOREIGN KEY (session_id) REFERENCES session (id) ON DELETE CASCADE,
  PRIMARY KEY(session_id, "key")
);

CREATE INDEX session_key_indexed_IX ON session_data ("key", "indexed");

CREATE TABLE presentation (
  id integer PRIMARY KEY NOT NULL,
  session_id integer NOT NULL,
  FOREIGN KEY (session_id) REFERENCES session (id) ON DELETE CASCADE
);


CREATE TABLE presentation_data (
  presentation_id integer NOT NULL,
  "key" varchar(128) NOT NULL,
  val text,
  "indexed" varchar(1024),
  FOREIGN KEY (presentation_id) REFERENCES presentation (id) ON DELETE CASCADE,
  PRIMARY KEY(presentation_id, "key")
);

CREATE INDEX presentation_key_indexed_IX ON presentation_data ("key" ASC, "indexed" ASC);


CREATE TABLE author (
  id SERIAL PRIMARY KEY,
  person_id integer DEFAULT NULL,
  first_char char(1) NOT NULL,
  "author_hash" char(40) NOT NULL,
  "email" varchar(1024) NOT NULL,
  "name" varchar(1024) NOT NULL,
  "first_name" varchar(1024) DEFAULT NULL,
  "last_name" varchar(1024) DEFAULT NULL,
  "organisation" varchar(1024) NOT NULL
);
CREATE UNIQUE INDEX author_author_hash_UQ ON author ("author_hash" ASC);
CREATE INDEX author_first_char_IX ON author ("first_char" ASC);
CREATE INDEX author_email_IX ON author ("email" ASC);
CREATE INDEX author_person_id_IX ON author ("person_id" ASC);


CREATE TABLE presentation_to_author (
  presentation_id integer NOT NULL,
  author_id integer NOT NULL,
  FOREIGN KEY (presentation_id) REFERENCES presentation (id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES author (id) ON DELETE CASCADE
);
