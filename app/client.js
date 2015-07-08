import React from 'react';
import { Router } from 'react-router';
import { history } from 'react-router/lib/BrowserHistory';
import routes from './src/routes.js';
import { Provider } from 'redux/lib/react';
import createRedux from './src/createRedux.js';


const redux = createRedux(window.__INITIAL_DATA__);
React.render((
    <Provider redux={redux}>
        {() => <Router history={history} children={routes}/> }
    </Provider>
), document.getElementById('app'));
