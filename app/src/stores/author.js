import createStore from '../createStore.js'
import constants from '../constants.js';

export default createStore(null, {
    [constants.AUTHOR_GET_SUCCESS]: (state, action) => {
        return action.payload;
    }
});
