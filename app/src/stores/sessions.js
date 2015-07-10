import createStore from '../createStore.js'
import constants from '../constants.js';
import { dates } from '../config.js';
import { getRandomInt } from '../utils.js';
import moment from 'moment';
moment.locale('en');


export default createStore(null, {
    [constants.SESSION_LIST_SUCCESS]: (state, action) => {
        const { params } = action;
        const sessions = action.payload.reduce((sessions, session) => {
            const start = moment(session.start).format('YYYY-MM-DD');
            if (dates.indexOf(start) === -1) {
                sessions['tba'] = (sessions['tba'] || []).concat([session]);
            } else {
                sessions[start] = (sessions[start] || []).concat([session]);
            }
            return sessions;
        }, {});

        return { sessions, params };
    }
});
