import createStore from '../createStore.js'
import constants from '../constants.js';
import { dates } from '../config.js';
import { getRandomInt } from '../utils.js';
import moment from 'moment';
moment.locale('en');


export default createStore(null, {
    [constants.AUTHORS_BY_FIRST_CHAR_LIST_SUCCESS]: (state, action) => {
        return {
            char: action.char,
            list: action.payload
        }
    }
});
