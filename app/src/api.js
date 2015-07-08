import superagent from 'superagent';
import Promise from './Promise.js';
import { appUrl } from './config.js';


function promise(req) {
    return new Promise((resolve, reject) => {
        req.end((err, res) => {
            if (err) {
                reject(err);
            } else {
                if (!res.ok) {
                    reject(res.error);
                } else {
                    resolve(res.body);
                }
            }
        })
    });
}

export function listTypes() {
    return promise(superagent.get(appUrl + '/api/types'));
}

export function listSessions(params) {
    return promise(superagent.get(appUrl + '/api/sessions').query(params || {}));
}

export function getPresentation(id) {
    return promise(superagent.get(appUrl +'/api/presentations/' + id));
}
