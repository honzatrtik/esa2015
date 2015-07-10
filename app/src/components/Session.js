import React from 'react';
import { Link } from 'react-router';

import moment from 'moment';
moment.locale('en');

export default class Session extends React.Component {

    constructor(props) {
        super(props);
        ['renderPresentation'].forEach(f => this[f] = this[f].bind(this));
    }

    renderPresentation(presentation) {
        return (
            <div key={presentation.id} className="presentation">
                <Link className="presentation-link" to={`/presentation/${presentation.id}`}>
                    <h5 key="title" className="presentation-title">
                        <div className="row">
                            <div className="col-md-11">{presentation.title}</div>
                            <div className="col-md-1">{presentation.type}</div>
                        </div>
                    </h5>
                    <p key="description">
                        <span key="authors">{presentation.authors}</span><br />
                        <em key="organisations">{presentation.organisations}</em>
                    </p>
                </Link>
            </div>
        );
    }

    render() {
        const { session } = this.props;
        return (
            <div className="session">
                <div key="header" className="row session-header">
                    <div key="time" className="col-md-1">
                        <h4>{moment(session.start).format('HH:mm')}</h4>
                    </div>
                    <div key="room" className="col-md-2">
                        <h4>{session.room || 'room'}</h4>
                    </div>
                    <div key="title" className="col-md-9">
                        <h4>{session.title}</h4>
                    </div>
                </div>
                <div key="presentations" className="presentations row">
                    <div className="col-md-9  col-md-offset-3">
                        {session.presentations.map(this.renderPresentation)}
                    </div>
                </div>
            </div>
        );
    }
}