import express from 'express';
import pg from 'pg';
import squel from 'squel';
import apicache from 'apicache';
import { dbUrl } from './configServer.js';
import cors from 'cors';
import Promise from './Promise.js';
import moment from 'moment';
moment.locale('en');

const squelPg = squel.useFlavour('postgres');
squelPg.cls.DefaultQueryBuilderOptions.tableAliasQuoteCharacter = '"';

let cache = apicache.options({
    debug: process.env.NODE_ENV !== 'production'
}).middleware;


function query() {
    let args = Array.prototype.slice.call(arguments);
    return new Promise((resolve, reject) => {
        pg.connect(dbUrl, (err, client, done) => {
            if (err) {
                done();
                reject(err);
            } else {
                args.push((err, result) => {
                    done();
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
                client.query.apply(client, args);
            }
        });
    });
}

function getPresentations(build) {
    let builder = squelPg.select()
        .from('v_presentation', 'p')
        .field('id')
        .field('session_id')
        .field('acceptance')
        .field('type')
        .field('title')
        .field('authors')
        .field('organisations')
        .field('presenting_author')
        .order('position');

    typeof build === 'function' && build(builder);

    return query(builder.toString()).then(result => {
        return result.rows;
    });
}

function getSessions(build) {

    const builder = squelPg.select()
        .from('v_session')
        .field('*')
        .order('start')
        .order('short');

    typeof build === 'function' && build(builder);

    return query(builder.toString()).then(result => {
        return result.rows;
    });
}


let app = express();
app.use(cors());

app.get('/types', cache('1 minute'), (req, res) => {

    const sql = squelPg.select()
        .from('presentation_data', 'd1')
        .field('DISTINCT d1.indexed', 'type')
        .where('d1.key = ?', 'contribution_type')
        .toString();

    query(sql).then(result => {
        res.json(result.rows.map(row => row.type));
    });
});

app.get('/firstChars', cache('1 minute'), (req, res) => {

    const sql = squelPg.select()
        .from('v_author')
        .field('DISTINCT upper(first_char)', 'char')
        .order('upper(first_char)')
        .toString();

    query(sql).then(result => {
        res.json(result.rows.map(row => row['char']));
    });
});

app.get('/authorsByFirstChar/:char', cache('1 minute'), (req, res) => {

    const sql = squelPg.select()
        .from('v_author')
        .field('*')
        .where('upper(first_char) = ?', req.params.char.toUpperCase())
        .order('last_name')
        .order('first_name')
        .toString();

    query(sql).then(result => {
        res.json(result.rows);
    });
});


app.get('/rooms', cache('1 minute'), (req, res) => {

    const sql = squelPg.select()
        .field('DISTINCT room_id, room')
        .from('v_session')
        .where('room_id IS NOT NULL')
        .order('room')
        .toString();

    query(sql).then(result => {
        res.json(result.rows.reduce((map, row) => {
            map[row['room_id']] = row;
            return map;
        }, {}));
    });
});

app.get('/sessions', cache('1 minute'), (req, res) => {
    getPresentations().then(presentations => {
        if (!presentations.length) {
            return res.json([]);
        }
        getSessions(builder => {
            builder.where('id IN ?', presentations.map(row => row['session_id']));
        }).then(sessions => {
            res.json(sessions.map(session => {
                session.presentations = presentations.filter(row => row['session_id'] === session['id']);
                return session;
            }));
        })
    });
});

app.get('/sessionsByDate/:date', cache('1 minute'), (req, res) => {

    const date = Date.parse(req.params.date);
    if (isNaN(date)) {
        return res.sendStatus(400);
    }

    getSessions(builder => {
        builder.where('start::date = ?', moment(date).format('YYYY-MM-DD'));
        if (req.query.type) {
            const subselect = squelPg.select()
                .field('DISTINCT session_id')
                .from('v_presentation')
                .where('type = ?', req.query.type);
            builder.where('id IN ?', subselect);
        }
    }).then(sessions => {
        if (!sessions.length) {
            return res.json([]);
        }
        getPresentations(builder => {
            builder.where('session_id IN ?', sessions.map(row => row['id']));
        }).then(presentations => {
             res.json(sessions.map(session => {
                session.presentations = presentations.filter(row => row['session_id'] === session['id']);
                return session;
            }));
        });
    });
});

app.get('/sessionsByRoomId/:roomId', (req, res) => {
    getSessions(builder => {
        builder.where('room_id = ?',req.params.roomId);
    }).then(sessions => {
        if (!sessions.length) {
            return res.json([]);
        }
        getPresentations(builder => {
            builder.where('session_id IN ?', sessions.map(row => row['id']));
        }).then(presentations => {
            res.json(sessions.map(session => {
                session.presentations = presentations.filter(row => row['session_id'] === session['id']);
                return session;
            }));
        });
    });
});

app.get('/authors/:hash', (req, res) => {

    const sql = squelPg.select()
        .field('*')
        .from('author', 'a')
        .where('a.author_hash = ?', req.params.hash)
        .toString();

    query(sql).then(result => {
        res.json(result.rows[0]);
    });

});

app.get('/sessionsByAuthorHash/:hash', (req, res) => {
    getSessions(builder => {

        const subselect = squelPg.select()
            .field('DISTINCT p.session_id')
            .from('author', 'a')
            .join('presentation_to_author', 'pa', 'a.id = pa.author_id')
            .join('presentation', 'p', 'pa.presentation_id = p.id')
            .where('a.author_hash = ?', req.params.hash);
        builder.where('id IN ?', subselect);

    }).then(sessions => {
        if (!sessions.length) {
            return res.json([]);
        }
        getPresentations(builder => {
            builder.where('session_id IN ?', sessions.map(row => row['id']));
        }).then(presentations => {
            res.json(sessions.map(session => {
                session.presentations = presentations.filter(row => row['session_id'] === session['id']);
                return session;
            }));
        });
    });
});

app.get('/presentations/:id', cache('1 minute'), (req, res) => {

    getPresentations(builder => {
        builder.where('id = ?', req.params.id).field('abstract');
    }).then(rows => {

        let presentation = rows[0];
        if (presentation) {

            getPresentations(builder => {
                builder
                    .field('abstract')
                    .where('session_id = ?', presentation['session_id']);

            }).then(presentations => {
                getSessions(builder => {
                    if (presentations.length) {
                        builder.where('id IN ?', presentations.map(row => row['session_id']));
                    }
                }).then(sessions => {

                    let session = sessions[0];
                    session.presentations = presentations;
                    presentation.session = session;
                    res.json(presentation);
                })
            });

        } else {
            return res.sendStatus(404);
        }

    });
});


export default app;