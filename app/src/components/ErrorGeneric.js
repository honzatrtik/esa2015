import React from 'react';
import { Link } from 'react-router';
import DocumentTitle from 'react-document-title';

export default class ErrorGeneric extends React.Component {

    render() {
        const { title, children } = this.props;
        return (
            <DocumentTitle title={['Error', ' | ESA 2015 Prague'].join('  ')}>
                <div>

                    <div className="container">

                        <div className="row">
                            <div className="col-md-2">
                                <h2><span className="label label-danger">Error</span></h2>
                            </div>
                            <div className="col-md-10">
                                <h1>{title}</h1>
                                <div>{children}</div>
                            </div>
                        </div>

                    </div>
                </div>
            </DocumentTitle>
        );
    }
}