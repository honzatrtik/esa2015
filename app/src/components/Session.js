import React from 'react';
import { Link } from 'react-router';
import cs from 'react-classset';
import moment from 'moment';
moment.locale('en');

export default class Session extends React.Component {

    constructor(props) {
        super(props);
        ['renderPresentation'].forEach(f => this[f] = this[f].bind(this));
    }

    renderPresentation(presentation) {
        const isContributingPaper = presentation.acceptance === 'Contributing Paper';
        const classes = cs({
            'is-contributing-paper': isContributingPaper,
            presentation: true
        });
        return (
            <div key={presentation.id} className={classes}>
                <Link className="presentation-link" to={`/presentation/${presentation.id}`}>
                    <h5 key="title" className="presentation-title">
                        <div className="row">
                            <div className="col-md-11">{presentation.title}</div>
                            <div className="col-md-1 text-muted">{presentation.type}</div>
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

        const start = moment(session.start).format('HH:mm');
        const end = moment(session.end).format('HH:mm');

        return (
            <div className="session">
                <div key="header" className="row session-header">

                    <div key="time-room" className="col-md-3">
                        <h5>
                            {start == '00:00' ? <abbr title="To be announced">tba</abbr> : [start, end].join('\u00a0-\u00a0')}
                            {'\u00a0\u00a0'}
                            {session.room && ['room', session.room].join(' ')}
                        </h5>
                    </div>

                    <div key="title" className="col-md-8">
                        <h4>{session.title}</h4>
                    </div>
                    <div key="short" className="col-md-1">
                        <h5 className="text-muted">{session.short}</h5>
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