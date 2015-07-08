import createStore from '../createStore.js'
import constants from '../constants.js';

export default createStore(null, {
    [constants.TYPES_LIST_SUCCESS]: (state, action) => {
        return action.payload;
    }
});
