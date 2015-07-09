import React from 'react';
import { Link } from 'react-router';
import { getSessions } from '../api.js';
import DayFilter from './DayFilter.js'
import TypeFilter from './TypeFilter.js'

import loader from '../createLoaderDecorator.js';
import { listSessionsAction, listTypesAction } from '../actions/actions.js';
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
        let promises = [];
        const state = getState();
        promises.push(listSessionsAction(dispatch)({ type: props.location.query && props.location.query.type }));
        if (!state.types) {
            promises.push(listTypesAction(dispatch)());
        }
        return Promise.all(promises);
    },
    (state, props) => {
        return {
            sessions: state.sessions.sessions[props.params.activeDate],
            types: state.types
        }
    },
    (state, props) => (props.location.query && props.location.query.type) == (state.sessions.params && state.sessions.params.type)
)
export default class Sessions extends React.Component {

    static propTypes = {
        sessions: React.PropTypes.array.isRequired
    };

    constructor(props) {
        super(props);
        [].forEach(f => this[f] = this[f].bind(this));
    }

    render() {
        const dates = config.dates;
        const { activeDate, location, sessions, types, params, loading } = this.props;

        return (
            <DocumentTitle title={["Programme - ", moment(activeDate).format('ddd D. M.'), " | ESA 2015 Prague"].join('  ')}>
                <div>
                    <div key="filter" className="filters row">
                        <div key="dayFilter" className="col-md-8">
                            <DayFilter {...location} dates={dates} activeDate={params.activeDate}/>
                        </div>
                        <div key="typeFilter" className="col-md-4">
                            <TypeFilter {...location} types={types} activeType={location.query && location.query.type}/>
                        </div>
                    </div>

                    <div style={{ opacity: loading ? .5 : 1 }} key="sessions" className="row">
                        <div className="col-md-12">
                            {sessions.map(s => <Session key={s.id} session={s} />)}
                        </div>
                    </div>
                </div>
            </DocumentTitle>
        );
    }
}