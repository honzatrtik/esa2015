import React from 'react';
import { Link } from 'react-router';
import { getSessions } from '../api.js';
import DayFilter from './DayFilter.js'
import TypeFilter from './TypeFilter.js'

import loader from '../createLoaderDecorator.js';
import { listSessionsByAuthorHashAction, getAuthorAction } from '../actions/actions.js';
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
            listSessionsByAuthorHashAction(dispatch)(props.params.hash),
            getAuthorAction(dispatch)(props.params.hash)
        ]);
    },
    (state, props) => {
        return {
            sessions: state.sessionsByAuthorHash.list,
            author: state.author
        };
    },
    (state, props) => {
        return state.sessionsByAuthorHash
            && props.params.hash == state.sessionsByAuthorHash.hash
    }
)
export default class SessionsByAuthorHash extends React.Component {

    static propTypes = {
        sessions: React.PropTypes.array.isRequired,
        author: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        [].forEach(f => this[f] = this[f].bind(this));
    }

    render() {
        const dates = config.dates;

        const { location, sessions, author, params, loading  } = this.props;

        return (
            <DocumentTitle title={['Sessions by participant ', author.name, ' | ESA 2015 Prague'].join('  ')}>
                <div style={{ opacity: loading ? .4 : 1 }}>

                    <ul key="links" className="pager">
                        <li className="previous"><Link to="/index">← back to participant index</Link></li>
                    </ul>

                    <h1>Sessions by participant {author.name}</h1>

                    <div key="sessions">
                        <div className="row">
                            <div className="col-md-12">
                                {(sessions || []).map(s => <Session showRoom={true} showDate={true} showTime={true} key={s.id} session={s} />)}
                                {!sessions.length && <div className="text-muted text-center">There is no programme for this author yet.</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </DocumentTitle>
        );
    }
}
