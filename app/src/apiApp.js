import express from 'express';
import pg from 'pg';
import squel from 'squel';
import apicache from 'apicache';
import { dbUrl } from './config.js';
import cors from 'cors';

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


let app = express();
app.use(cors());

app.get('/types', cache('30 minutes'), (req, res) => {

    const sql = squelPg.select()
        .from('presentation_data', 'd1')
        .field('DISTINCT d1.indexed', 'type')
        .where('d1.key = ?', 'contribution_type')
        .toString();

    query(sql).then(result => {
        res.json(result.rows.map(row => row.type));
    });
});

app.get('/sessions', cache('5 minutes'), (req, res) => {

    let builder = squelPg.select()
        .from('v_presentation', 'p')
        .field('id')
        .field('session_id')
        .field('type')
        .field('title')
        .field('authors')
        .field('organisations')
        .field('presenting_author');

    if (req.query.type) {
        builder.where('p.type = ?', req.query.type);
    }

    const sql = builder.toString();

    query(sql).then(result => {
        const presentations = result.rows;
        const sql = squelPg.select()
            .from('v_session', 's')
            .field('*')
            .where('s.id IN ?', presentations.map(row => row['session_id']))
            .order('s.start')
            .toString();

        query(sql).then(result => {
            res.json(result.rows.map(session => {
                session.presentations = presentations.filter(row => row['session_id'] === session['id']);
                return session;
            }));
        })
    });

});

app.get('/presentations/:id', cache('5 minutes'), (req, res) => {

    let builder = squelPg.select()
        .from('v_presentation', 'p')
        .field('*')
        .where('p.id = ?', req.params.id);
    const sql = builder.toString();
    query(sql).then(result => {
        res.json(result.rows[0]);
    });
});


export default app;