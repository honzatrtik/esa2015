import React from 'react';
import { Link } from 'react-router';
import { getSessions } from '../api.js';
import DayFilter from './DayFilter.js'
import TypeFilter from './TypeFilter.js'

import loader from '../createLoaderDecorator.js';
import { listSessionsByRoomIdAction, listRoomsAction } from '../actions/actions.js';
import config from '../config.js';
import { getRandomInt }  from '../utils.js';
import DocumentTitle from 'react-document-title';
import Session from './Session.js';
import Promise from '../Promise.js';
import shallowEqual from 'react/lib/shallowEqual.js';
import moment from 'moment';
moment.locale('en');

@loader(
    (dispatch, props, getState) => {
        return Promise.all([
          listSessionsByRoomIdAction(dispatch)(props.params.roomId),
          listRoomsAction(dispatch)()
        ]);
    },
    (state, props) => {
        return {
            sessions: state.sessionsByRoomId.list,
            room: state.rooms[props.params.roomId]
        };
    },
    (state, props) => {
        return state.sessionsByRoomId
            && props.params.roomId == state.sessionsByRoomId.roomId
            && state.rooms;
    }
)
export default class SessionsByRoomId extends React.Component {

    static propTypes = {
        sessions: React.PropTypes.array.isRequired,
        room: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        [].forEach(f => this[f] = this[f].bind(this));
    }

    render() {
        const dates = config.dates;

        const { location, sessions, room, params, loading  } = this.props;

        return (
            <DocumentTitle title={['Sessions in room  ', room.room, ' | ESA 2015 Prague'].join('  ')}>
                <div style={{ opacity: loading ? .4 : 1 }}>

                    <ul key="links" className="pager">
                        <li className="previous"><Link to="/rooms">← back to room list</Link></li>
                    </ul>

                    <h1>Sessions in room {room.room}</h1>

                    <div key="sessions">
                        <div className="row">
                            <div className="col-md-12">
                                {(sessions || []).map(s => <Session showRoom={false} showDate={true} showTime={true} key={s.id} session={s} />)}
                                {!sessions.length && <div className="text-muted text-center">There is no programme in this room yet.</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </DocumentTitle>
        );
    }
}
