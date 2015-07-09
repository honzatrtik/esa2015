import React from 'react';
import { Link } from 'react-router';
import { getSessions } from '../api.js';
import DayFilter from './DayFilter.js'

import loader from '../createLoaderDecorator.js';
import { getPresentationAction } from '../actions/actions.js';
import config from '../config.js';
import { getRandomInt }  from '../utils.js';
import DocumentTitle from 'react-document-title';

import moment from 'moment';
moment.locale('en');

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
export default class Presentations extends React.Component {

    static propTypes = {
        presentation: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        [].forEach(f => this[f] = this[f].bind(this));
    }

    render() {
        const { presentation } =  this.props;

        return (
            <DocumentTitle title={[presentation.title,  "| ESA 2015 Prague"].join('  ')}>
                <div className="presentation">
                    <h2 className="presentation-title" key="title">
                        {presentation.title}
                    </h2>
                    <p key="description">
                        <span className="tex-muted" key="type">{presentation.type}</span><br />
                        <span key="authors">{presentation.authors}</span><br />
                        <em key="organisations">{presentation.organisations}</em>
                    </p>
                    <p key="abstract">
                        {presentation.abstract}
                    </p>
                </div>
            </DocumentTitle>
        );
    }
}