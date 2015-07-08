import createStore from '../createStore.js'
import constants from '../constants.js';
import { dates } from '../config.js';
import { getRandomInt } from '../utils.js';

export default createStore(null, {
    [constants.SESSION_LIST_SUCCESS]: (state, action) => {
        let sessions = {};
        dates.forEach(date => {
            const start = getRandomInt(0, parseInt(action.payload.length / 2));
            sessions[date] = action.payload.slice(start, start + 140);
        });
        return sessions;
    }
});
