import React from 'react';
import { Link } from 'react-router';
import loader from '../createLoaderDecorator.js';
import { listAuthorsByFirstCharAction, listFirstCharsAction } from '../actions/actions.js';
import config from '../config.js';
import DocumentTitle from 'react-document-title';
import moment from 'moment';
moment.locale('en');


@loader(
    (dispatch, props, getState) => {
        return Promise.all([
            listAuthorsByFirstCharAction(dispatch)(props.params.char),
            listFirstCharsAction(dispatch)()
        ]);
    },
    (state, props) => {
        return {
            authors: state.authorsByFirstChar.list,
            char: state.authorsByFirstChar.char
        };
    },
    (state, props) => {
        return state.authorsByFirstChar
            && props.params.char == state.authorsByFirstChar.char
            && state.firstChars;
    }
)
export default class AuthorsByFirstChar extends React.Component {

    static propTypes = {
        authors: React.PropTypes.array.isRequired,
        char: React.PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);
        ['renderAuthor'].forEach(f => this[f] = this[f].bind(this));
    }

    renderAuthor(author) {
        return (
        <div className="col-md-12 author" key={author.author_hash}>

                <h4>
                    <Link key="authors" to={`/author/${author.author_hash}`}>{author.name}</Link><br />
                    <small key="organisations"><em>{author.organisation}</em></small>
                </h4>

        </div>
        );
    }

    render() {

        const { location, char, authors, loading } = this.props;
        return (
            <DocumentTitle title={['Index of Participants ', `"${char}"`, ' | ESA 2015 Prague'].join('  ')}>
                <div style={{ opacity: loading ? .4 : 1 }}>

                    <ul key="links" className="pager">
                        <li className="previous"><Link to="/index">← back to alphabetic index of participants</Link></li>
                    </ul>

                    <h1 key="title">
                        Index of participants "{char}"
                    </h1>

                    <div key="rooms">
                        <div className="row">
                            {authors.map(this.renderAuthor)}
                        </div>
                    </div>
                </div>
            </DocumentTitle>
        );
    }
}
