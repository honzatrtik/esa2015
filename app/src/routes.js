import React from 'react';
import { Route, Redirect } from 'react-router';
import App from './components/App.js';
import Sessions from './components/Sessions.js';
import SessionsByRoomId from './components/SessionsByRoomId.js';
import SessionsByAuthorHash from './components/SessionsByAuthorHash.js';
import Rooms from './components/Rooms.js';
import FirstChars from './components/FirstChars.js';
import AuthorsByFirstChar from './components/AuthorsByFirstChar';
import Error404 from './components/Error404.js';
import Presentation from './components/Presentation.js';
import { dates } from './config.js';

import moment from 'moment';
moment.locale('en');

const now = moment();
let activeDate = dates.filter(date => now.isSame(date, 'day'))[0];
if (!activeDate) {
    activeDate = dates[0];
}

export default [
    <Route component={App}>
        <Redirect from="/" to={`/sessions/${activeDate}`} />
        <Redirect from="/sessions" to={`/sessions/${activeDate}`} />
        <Route path="/sessions/:activeDate" component={Sessions}/>
        <Route path="/presentation/:id" component={Presentation}/>
        <Route path="/rooms" component={Rooms}/>
        <Route path="/room/:roomId" component={SessionsByRoomId}/>
        <Route path="/index" component={FirstChars}/>
        <Route path="/index/:char" component={AuthorsByFirstChar}/>
        <Route path="/author/:hash" component={SessionsByAuthorHash}/>
    </Route>,
    <Route path="*" component={Error404} />
];
