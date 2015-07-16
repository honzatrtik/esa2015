import React from 'react';
import { Router } from 'react-router';
import { history } from 'react-router/lib/BrowserHistory';
import routes from './src/routes.js';
import { Provider } from 'redux/lib/react';
import createRedux from './src/createRedux.js';
import ErrorGeneric from './src/components/ErrorGeneric.js';


function handleError() {
    console.log(arguments);
    React.render(<ErrorGeneric title="" message="" />, document.getElementById('app'));
}


const redux = createRedux(window.__INITIAL_DATA__);
React.render((
    <Provider redux={redux}>
        {() => <Router onError={handleError} onUpdate={() => window.ga('_trackPageview')} history={history} children={routes}/> }
    </Provider>
), document.getElementById('app'));





