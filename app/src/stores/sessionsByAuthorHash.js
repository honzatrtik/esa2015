import createStore from '../createStore.js'
import constants from '../constants.js';
import { dates } from '../config.js';
import { getRandomInt } from '../utils.js';
import moment from 'moment';
moment.locale('en');


export default createStore(null, {
    [constants.SESSION_LIST_BY_AUTHOR_HASH_SUCCESS]: (state, action) => {
        return {
            hash: action.hash,
            list: action.payload
        }
    }
});
