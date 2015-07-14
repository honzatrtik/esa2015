import React from 'react';
import { Link } from 'react-router';
import { getSessions } from '../api.js';
import DayFilter from './DayFilter.js'
import TypeFilter from './TypeFilter.js'

import loader from '../createLoaderDecorator.js';
import { listSessionsByDateAction, listTypesAction } from '../actions/actions.js';
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
        promises.push(listSessionsByDateAction(dispatch)(props.params.activeDate, { type: props.location.query && props.location.query.type }));
        if (!state.types) {
            promises.push(listTypesAction(dispatch)());
        }
        return Promise.all(promises);
    },
    (state, props) => {
        return {
            sessions: state.sessionsByDate.list,
            types: state.types,
            date: state.sessionsByDate.date
        };
    },
    (state, props) => {
        return state.types
            && state.sessionsByDate
            && ((props.location.query && props.location.query.type) == (state.sessionsByDate.query && state.sessionsByDate.query.type))
            && state.sessionsByDate.date === props.params.activeDate
    }
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


        const { location, sessions, types, params, loading, showTba } = this.props;

        return (
            <DocumentTitle title={['Programme - ', moment(params.activeDate).format('ddd D. M.'), ' | ESA 2015 Prague'].join('  ')}>
                <div style={{ opacity: loading ? .4 : 1 }}>
                    <div key="filter" className="filters row">
                        <div key="dayFilter" className="col-md-6">
                            <DayFilter showTba={showTba} {...location} dates={dates} activeDate={params.activeDate}/>
                        </div>
                        <div key="typeFilter" className="col-md-6">
                            <TypeFilter {...location} types={types} activeType={(location.query && location.query.type) || ''}/>
                        </div>
                    </div>

                    <div key="sessions">
                        <div className="row">
                            <div className="col-md-12">
                                {(sessions || []).map(s => <Session key={s.id} session={s} />)}
                                {!sessions.length && <div className="text-muted text-center">There is no programme for this day / selected RN/RS or the programme will be announced soon</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </DocumentTitle>
        );
    }
}