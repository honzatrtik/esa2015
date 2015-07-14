import superagent from 'superagent';
import Promise from './Promise.js';
import { appUrl } from './config.js';


let requests = {};
function promise(req, name) {
    if (name && requests[name]) {
        requests[name].abort();
    }
    requests[name] = req;
    return new Promise((resolve, reject) => {
        req.end((err, res) => {
            delete requests[name];
            if (err) {
                reject(err);
            } else {
                if (!res.ok) {
                    reject(res.error);
                } else {
                    resolve(res.body);
                }
            }
        });
    });
}


export function listTypes() {
    return promise(superagent.get(appUrl + '/api/types'));
}

export function listSessionsByDate(date, query) {
    const req = superagent.get(appUrl + '/api/sessionsByDate/' + date).query(query || {});
    return promise(req, 'listSessionsByDate');
}

export function getPresentation(id) {
    return promise(superagent.get(appUrl +'/api/presentations/' + id));
}
