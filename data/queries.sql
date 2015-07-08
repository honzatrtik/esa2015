
DROP VIEW IF EXISTS v_session;
CREATE VIEW v_session AS
  SELECT
    s.id,
    coalesce(d1.indexed, d1.val) AS short,
    coalesce(d2.indexed, d2.val) AS start,
    coalesce(d3.indexed, d3.val) AS end,
    coalesce(d4.indexed, d4.val) AS title,
    coalesce(d5.indexed, d5.val) AS roomId,
    coalesce(d6.indexed, d6.val) AS room
  FROM session AS s
    LEFT JOIN session_data AS "d1" ON ((s.id = d1.session_id) AND (d1.key = 'session_short'))
    LEFT JOIN session_data AS "d2" ON ((s.id = d2.session_id) AND (d2.key = 'session_start'))
    LEFT JOIN session_data AS "d3" ON ((s.id = d3.session_id) AND (d3.key = 'session_end'))
    LEFT JOIN session_data AS "d4" ON ((s.id = d4.session_id) AND (d4.key = 'session_title'))
    LEFT JOIN session_data AS "d5" ON ((s.id = d5.session_id) AND (d5.key = 'session_room_ID'))
    LEFT JOIN session_data AS "d6" ON ((s.id = d6.session_id) AND (d6.key = 'session_room'));


DROP VIEW IF EXISTS v_presentation;
CREATE VIEW v_presentation AS
  SELECT
    p.id,
    p.session_id,
    coalesce(d1.indexed, d1.val) AS type,
    coalesce(d2.indexed, d2.val) AS authors,
    coalesce(d3.indexed, d3.val) AS organisations,
    coalesce(d4.indexed, d4.val) AS presenting_author,
    coalesce(d5.indexed, d5.val) AS title,
    coalesce(d6.indexed, d6.val) AS abstract
  FROM presentation AS p
    LEFT JOIN presentation_data AS "d1" ON ((p.id = d1.presentation_id) AND (d1.key = 'contribution_type'))
    LEFT JOIN presentation_data AS "d2" ON ((p.id = d2.presentation_id) AND (d2.key = 'authors'))
    LEFT JOIN presentation_data AS "d3" ON ((p.id = d3.presentation_id) AND (d3.key = 'organisations'))
    LEFT JOIN presentation_data AS "d4" ON ((p.id = d4.presentation_id) AND (d4.key = 'presenting_author'))
    LEFT JOIN presentation_data AS "d5" ON ((p.id = d5.presentation_id) AND (d5.key = 'title'))
    LEFT JOIN presentation_data AS "d6" ON ((p.id = d6.presentation_id) AND (d6.key = 'abstract'));

