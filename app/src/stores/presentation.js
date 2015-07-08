import createStore from '../createStore.js'
import constants from '../constants.js';

export default createStore(null, {
    [constants.PRESENTATION_GET_SUCCESS]: (state, action) => {
        return action.payload;
    }
});
