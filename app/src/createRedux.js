import { createRedux, createDispatcher, composeStores } from 'redux';
import thunkMiddleware from 'redux/lib/middleware/thunk';
import promiseMiddleware from './middlewares/promiseMiddleware.js';
import loggerMiddleware from './middlewares/loggerMiddleware.js';
import * as stores from './stores/index.js';

const store = composeStores(stores);

export default function(initialState) {
    const dispatcher = createDispatcher(store, getState => [thunkMiddleware(getState), promiseMiddleware, loggerMiddleware]);
    return createRedux(dispatcher, initialState);
}

