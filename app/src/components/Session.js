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
                    <h4 key="title" className="presentation-title">
                        {presentation.title}
                    </h4>
                    <p key="description">
                        <span className="tex-muted" key="type">{presentation.type}</span><br />
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
                    <div key="room" className="col-md-1">
                        <h4>{session.room || 'room'}</h4>
                    </div>
                    <div key="title" className="col-md-10">
                        <h4>{session.title}</h4>
                    </div>
                </div>
                <div key="presentations" className="presentations row">
                    <div className="col-md-10  col-md-offset-2">
                        {session.presentations.map(this.renderPresentation)}
                    </div>
                </div>
            </div>
        );
    }
}