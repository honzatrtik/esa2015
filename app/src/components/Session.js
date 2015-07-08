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
            <tr key={presentation.id}>
                <td>
                    <h5 key="title">
                        {presentation.title}
                    </h5>
                    <p key="description">
                        <span key="type">{presentation.type}</span><br />
                        <em key="authors">{presentation.authors}</em><br />
                        <em key="organisations" className="text-muted">{presentation.organisations}</em>
                    </p>
                </td>
                <td style={{width: 140}}>
                    <Link to={`/presentation/${presentation.id}`}>view abstract</Link>
                </td>
            </tr>
        );
    }

    render() {
        const { session } = this.props;
        return (
            <div className="session">
                <div key="header" className="row session-header">
                    <div key="time" className="col-md-1">
                        <h4>{moment(session.start).format('HH:mm')}</h4>
                        <h5>{session.room}</h5>
                    </div>
                    <div key="title" className="col-md-11">
                        <h4>{session.title}</h4>
                    </div>
                </div>
                <div key="presentations" className="row">
                    <div className="col-md-11  col-md-offset-1">
                        <table className="table table-hover">
                            {session.presentations.map(this.renderPresentation)}
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}