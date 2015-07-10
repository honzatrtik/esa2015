import React from 'react';
import { Link } from 'react-router';
import { getSessions } from '../api.js';

import loader from '../createLoaderDecorator.js';
import { listSessionsAction } from '../actions/actions.js';
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
        const state = getState();
        return listSessionsAction(dispatch)({ type: props.location.query && props.location.query.type });
    },
    (state, props) => {
        return {
            sessions: state.sessions.sessions
        }
    },
    (state, props) => state.sessions.sessions
)
export default class SessionsAll extends React.Component {

    static propTypes = {
        sessions: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        [].forEach(f => this[f] = this[f].bind(this));
    }

    renderDay(date, sessions) {
        return (
            <div key={date}>
                <h2 key="title">{moment(date).format('ddd D. M.')}</h2>
                <div key="sessions">
                    <div className="row">
                        <div className="col-md-12">
                            {(sessions || []).map(s => <Session key={s.id} session={s} />)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const dates = config.dates;
        const { sessions } = this.props;

        return (
            <DocumentTitle title={["Programme ", "| ESA 2015 Prague"].join('  ')}>
                <div>
                    {Object.keys(sessions).map(date => this.renderDay(date, sessions[date]))}
                </div>
            </DocumentTitle>
        );
    }
}