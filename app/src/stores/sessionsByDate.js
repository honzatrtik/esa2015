import createStore from '../createStore.js'
import constants from '../constants.js';
import { dates } from '../config.js';
import { getRandomInt } from '../utils.js';
import moment from 'moment';
moment.locale('en');


export default createStore(null, {
    [constants.SESSION_LIST_BY_DATE_SUCCESS]: (state, action) => {
        return {
            date: action.date,
            query: action.query,
            list: action.payload
        }
    }
});
