import createStore from '../createStore.js'
import constants from '../constants.js';

export default createStore(null, {
    [constants.ROOMS_LIST_SUCCESS]: (state, action) => {
        return action.payload;
    }
});
