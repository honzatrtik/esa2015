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
        });
    });
}


export function listTypes() {
    return promise(superagent.get(appUrl + '/api/types'));
}

export function listRooms() {
    return promise(superagent.get(appUrl + '/api/rooms'));
}

export function listFirstChars() {
    return promise(superagent.get(appUrl + '/api/firstChars'));
}


export function listAuthorsByFirstChar(char) {
    return promise(superagent.get(appUrl + '/api/authorsByFirstChar/' + char));
}

export function listSessionsByDate(date, query) {
    const req = superagent.get(appUrl + '/api/sessionsByDate/' + date).query(query || {});
    return promise(req);
}

export function listSessionsByAuthorHash(hash) {
    const req = superagent.get(appUrl + '/api/sessionsByAuthorHash/' + hash);
    return promise(req);
}

export function listSessionsByRoomId(roomId) {
    const req = superagent.get(appUrl + '/api/sessionsByRoomId/' + roomId);
    return promise(req);
}

export function getPresentation(id) {
    return promise(superagent.get(appUrl +'/api/presentations/' + id));
}

export function getAuthor(hash) {
    return promise(superagent.get(appUrl +'/api/authors/' + hash));
}
