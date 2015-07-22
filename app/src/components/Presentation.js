import React from 'react';
import { Link, Navigation } from 'react-router';
import { getSessions } from '../api.js';
import DayFilter from './DayFilter.js'

import loader from '../createLoaderDecorator.js';
import { getPresentationAction } from '../actions/actions.js';
import config from '../config.js';
import { getRandomInt }  from '../utils.js';
import DocumentTitle from 'react-document-title';

import moment from 'moment';
moment.locale('en');

import reactMixin from 'react-mixin';

@loader(
    (dispatch, props, getState) => {
        return getPresentationAction(dispatch)(props.params.id);
    },
    (state, props) => {
        return { presentation: state.presentation }
    },
    (state, props) => {
        return state.presentation && (state.presentation.id == props.params.id);
    }
)
@reactMixin.decorate(Navigation)
export default class Presentations extends React.Component {

    static propTypes = {
        presentation: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        ['handleBackClick', 'goBack'].forEach(f => this[f] = this[f].bind(this));
    }

    handleBackClick(event) {
        event.preventDefault();
        this.goBack();
    }

    render() {
        const { presentation } =  this.props;
        const { session } = presentation;
        const start = moment(session.start).format('HH:mm');
        const end = moment(session.end).format('HH:mm');

        const date = moment(session.start).format('ddd D. M.');

        return (
            <DocumentTitle title={[presentation.title,  "| ESA 2015 Prague"].join('  ')}>
                <div>

                    <ul key="links" className="pager">
                        <li className="previous"><a href="" onClick={this.handleBackClick}>← back to sessions</a></li>
                    </ul>

                    <div key="presentation" className="presentation">

                        <div key="header" className="presentation-header">

                            <div key="title" className="row">
                                <div key="title" className="col-md-10">
                                    <h3>{session.title}</h3>
                                </div>
                                <div key="short" className="col-md-2">
                                    <h3 className="text-muted">{session.short}</h3>
                                </div>
                            </div>

                            <div key="date-room" className="row">
                                <div className="col-md-12">
                                    <h4>
                                        {start != '00:00' && date}{'\u00a0\u00a0'}
                                        {start == '00:00' ? <abbr title="To be announced">tba</abbr> : [start, end].join('\u00a0-\u00a0')}<br />
                                        {session.room && <Link title={'Show programme for room: ' + session.room}  to={`/room/${session.room_id}`}>room {session.room}</Link>}
                                    </h4>
                                </div>
                            </div>

                        </div>

                        <div className="row">
                            <div className="col-md-10">
                                <h1 className="presentation-title" key="title">
                                    {presentation.title}
                                </h1>
                            </div>
                            <div className="col-md-2">
                                <h2 className="text-muted">{presentation.type}</h2>
                            </div>
                        </div>

                        <p key="description">
                            <span key="authors">{presentation.authors}</span><br />
                            <em key="organisations">{presentation.organisations}</em>
                        </p>
                        <p className="u-pre-line u-muted-info" key="abstract">
                            {presentation.abstract}
                        </p>
                    </div>

                </div>
            </DocumentTitle>
        );
    }
}