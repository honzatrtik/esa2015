import React from 'react';
import { Link } from 'react-router';
import config from '../config.js';
import cs from 'react-classset';
import moment from 'moment';
moment.locale('en');


export default class PresentationPreview extends React.Component {

    static propTypes = {
        presentation: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        [].forEach(f => this[f] = this[f].bind(this));
    }

    render() {
        const { presentation } =  this.props;
        const isContributingPaper = presentation.acceptance === 'Contributing Paper';
        const classes = cs({
            'is-contributing-paper': isContributingPaper,
            presentation: true
        });
        return (
            <div className={classes}>
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
}