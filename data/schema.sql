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
  id integer PRIMARY KEY NOT NULL,
  "email" varchar(1024) NOT NULL,
  "name" varchar(1024) NOT NULL,
  "organisation" varchar(1024) NOT NULL
);
CREATE INDEX author_email_UQ ON author ("email" ASC);

CREATE TABLE presentation_to_author (
  presentation_id integer NOT NULL,
  author_id integer NOT NULL,
  FOREIGN KEY (presentation_id) REFERENCES presentation (id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES author (id) ON DELETE CASCADE
);
