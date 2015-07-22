import createStore from '../createStore.js'
import constants from '../constants.js';

export default createStore(null, {
    [constants.FIRST_CHARS_LIST_SUCCESS]: (state, action) => {
        return action.payload;
    }
});
