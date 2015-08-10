
DROP VIEW IF EXISTS v_session;
CREATE VIEW v_session AS
  SELECT
    s.id,
    coalesce(d1.indexed, d1.val) AS short,
    coalesce(d2.indexed, d2.val) AS start,
    coalesce(d3.indexed, d3.val) AS end,
    coalesce(d4.indexed, d4.val) AS title,
    coalesce(d5.indexed, d5.val) AS room_id,
    coalesce(d6.indexed, d6.val) AS room,
    coalesce(d7.indexed, d7.val) AS chair1,
    coalesce(d8.indexed, d8.val) AS chair2,
    coalesce(d9.indexed, d9.val) AS chair1_organisation,
    coalesce(d10.indexed, d10.val) AS chair2_organisation,
    coalesce(d11.indexed, d11.val) AS info,
    coalesce(d12.indexed, d12.val) AS chair1_email,
    coalesce(d13.indexed, d13.val) AS chair2_email,
    coalesce(d14.indexed, d14.val) AS chair1_email2,
    coalesce(d15.indexed, d15.val) AS chair2_email2
  FROM session AS s
    LEFT JOIN session_data AS "d1" ON ((s.id = d1.session_id) AND (d1.key = 'session_short'))
    LEFT JOIN session_data AS "d2" ON ((s.id = d2.session_id) AND (d2.key = 'session_start'))
    LEFT JOIN session_data AS "d3" ON ((s.id = d3.session_id) AND (d3.key = 'session_end'))
    LEFT JOIN session_data AS "d4" ON ((s.id = d4.session_id) AND (d4.key = 'session_title'))
    LEFT JOIN session_data AS "d5" ON ((s.id = d5.session_id) AND (d5.key = 'session_room_ID'))
    LEFT JOIN session_data AS "d6" ON ((s.id = d6.session_id) AND (d6.key = 'session_room'))
    LEFT JOIN session_data AS "d7" ON ((s.id = d7.session_id) AND (d7.key = 'chair1'))
    LEFT JOIN session_data AS "d8" ON ((s.id = d8.session_id) AND (d8.key = 'chair2'))
    LEFT JOIN session_data AS "d9" ON ((s.id = d9.session_id) AND (d9.key = 'chair1_organisation'))
    LEFT JOIN session_data AS "d10" ON ((s.id = d10.session_id) AND (d10.key = 'chair2_organisation'))
    LEFT JOIN session_data AS "d11" ON ((s.id = d11.session_id) AND (d11.key = 'session_info'))
    LEFT JOIN session_data AS "d12" ON ((s.id = d12.session_id) AND (d12.key = 'chair1_email'))
    LEFT JOIN session_data AS "d13" ON ((s.id = d13.session_id) AND (d13.key = 'chair2_email'))
    LEFT JOIN session_data AS "d14" ON ((s.id = d14.session_id) AND (d14.key = 'chair1_email2'))
    LEFT JOIN session_data AS "d15" ON ((s.id = d15.session_id) AND (d15.key = 'chair2_email2'))
  ;


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
    coalesce(d6.indexed, d6.val) AS abstract,
    coalesce(d7.indexed, d7.val) AS acceptance,
    coalesce(d8.indexed, d8.val) AS position
  FROM presentation AS p
    LEFT JOIN presentation_data AS "d1" ON ((p.id = d1.presentation_id) AND (d1.key = 'contribution_type'))
    LEFT JOIN presentation_data AS "d2" ON ((p.id = d2.presentation_id) AND (d2.key = 'authors'))
    LEFT JOIN presentation_data AS "d3" ON ((p.id = d3.presentation_id) AND (d3.key = 'organisations'))
    LEFT JOIN presentation_data AS "d4" ON ((p.id = d4.presentation_id) AND (d4.key = 'presenting_author'))
    LEFT JOIN presentation_data AS "d5" ON ((p.id = d5.presentation_id) AND (d5.key = 'title'))
    LEFT JOIN presentation_data AS "d6" ON ((p.id = d6.presentation_id) AND (d6.key = 'abstract'))
    LEFT JOIN presentation_data AS "d7" ON ((p.id = d7.presentation_id) AND (d7.key = 'acceptance'))
    LEFT JOIN presentation_data AS "d8" ON ((p.id = d8.presentation_id) AND (d8.key = 'order'))
  WHERE coalesce(d7.indexed, d7.val) IN (
    'Contributing Paper',
    'Poster',
    'Accepted',
    'Special'
  );


DROP VIEW IF EXISTS v_author;
CREATE VIEW v_author AS
  SELECT
    a.*
  FROM author AS a
  WHERE
    EXISTS (
        SELECT *
        FROM presentation_to_author pta
        JOIN v_presentation p ON (pta.presentation_id = p.id)
        WHERE pta.author_id = a.id
    );
