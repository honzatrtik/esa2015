import React from 'react';
import { Link } from 'react-router';
import loader from '../createLoaderDecorator.js';
import { listFirstCharsAction } from '../actions/actions.js';
import config from '../config.js';
import DocumentTitle from 'react-document-title';
import moment from 'moment';
moment.locale('en');

@loader(
    (dispatch, props, getState) => {
        return listFirstCharsAction(dispatch)();
    },
    (state, props) => {
        return {
            firstChars: state.firstChars
        };
    },
    (state, props) => {
        return state.firstChars
    }
)
export default class FirstChars extends React.Component {

    static propTypes = {
        firstChars: React.PropTypes.array.isRequired
    };

    constructor(props) {
        super(props);
        [].forEach(f => this[f] = this[f].bind(this));
    }

    render() {

        const { location, firstChars, params, loading } = this.props;

        return (
            <DocumentTitle title={['Author index', ' | ESA 2015 Prague'].join('  ')}>
                <div style={{ opacity: loading ? .4 : 1 }}>

                    <h1 key="title">
                        Author index
                    </h1>

                    <div key="rooms">
                        <div className="row">
                            {firstChars.map(char => <div className="col-md-1" key={char}><h4><Link to={`/index/${char}`}>{char}</Link></h4></div>)}
                        </div>
                    </div>
                </div>
            </DocumentTitle>
        );
    }
}
