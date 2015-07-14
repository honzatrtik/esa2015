import React from 'react';
import { Link } from 'react-router';
import cs from 'react-classset';
import moment from 'moment';
import PresentationPreview from './PresentationPreview.js';
moment.locale('en');

export default class Session extends React.Component {

    constructor(props) {
        super(props);
        ['renderPresentation'].forEach(f => this[f] = this[f].bind(this));
    }

    renderPresentation(presentation) {
        return <PresentationPreview key={presentation.id} presentation={presentation} />
    }

    render() {
        const { session } = this.props;

        const start = moment(session.start).format('HH:mm');
        const end = moment(session.end).format('HH:mm');

        const chairs = [session.chair1, session.chair2].filter(v=>v);
        const organisations = [session.chair1_organisation, session.chair2_organisation].filter(v=>v);;

        function renderChair(chair, i) {
            return (
                <div key={i} className="chairs-chair">
                    <span key="authors">{chair}</span><br />
                    <em key="organisations">{organisations[i]}</em>
                </div>
            );
        }

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
                    <div key="chairs" className="col-md-3">
                        <h5>{chairs.length > 1 ? 'Chairs:' : 'Chair:'}</h5>
                        {chairs.map(renderChair)}
                    </div>
                    <div key="presentations" className="col-md-9">
                        {session.presentations.map(this.renderPresentation)}
                    </div>
                </div>
            </div>
        );
    }
}