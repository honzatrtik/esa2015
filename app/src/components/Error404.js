import React from 'react';
import ErrorGeneric from './ErrorGeneric.js';

export default class Error404 extends React.Component {

    render() {
        const { location } = this.props;
        return (
            <ErrorGeneric title={`Page "${location.pathname}" not found`}>
                <p>
                    <strong>The page you’re looking for isn’t here.</strong><br />
                    Requested url either does not exist or is misspelled. Please, continue to <a href="/">homepage</a>.
                </p>
            </ErrorGeneric>
        );
    }
}