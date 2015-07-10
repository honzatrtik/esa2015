import React from 'react';
import { Route, Redirect } from 'react-router';
import App from './components/App.js';
import Sessions from './components/Sessions.js';
import SessionsAll from './components/SessionsAll.js';
import Presentation from './components/Presentation.js';
import { dates } from './config.js';

import moment from 'moment';
moment.locale('en');

const now = moment();
let activeDate = dates.filter(date => now.isSame(date, 'day'))[0];
if (!activeDate) {
    activeDate = dates[0];
}

export default (
    <Route component={App}>
        <Redirect from="/" to={`/sessions/${activeDate}`} />
        <Redirect from="/sessions" to={`/sessions/${activeDate}`} />
        <Route path="/sessions/:activeDate" component={Sessions}/>
        <Route path="/presentation/:id" component={Presentation}/>
        <Route path="/pdf" component={SessionsAll}/>
    </Route>
);