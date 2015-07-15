import React from 'react';
import { getTypes } from '../api.js';

import { Link } from 'react-router';
export default class App extends React.Component {

    render() {

        return (
            <div>
                <Link to="/" id="header">
                    <h1>ESA 2015 Prague - Conference Programme</h1>
                </Link>

                <div className="container">

                    <div className="row">
                        <div className="col-md-12">
                            <div className="alert alert-info">
                                <em>Note: Posters will be allocated on 15th July. Programme for RN32 will be announced as soon as possible - we are waiting for a time schedule from RN coordinator.</em>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}