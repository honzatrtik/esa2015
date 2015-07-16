import React from 'react';
import { getTypes } from '../api.js';

import { Link } from 'react-router';
export default class App extends React.Component {

    render() {

        return (
            <div>
                <Link to="/" id="header">
                    <h2>ESA 2015 Prague - Conference Programme</h2>
                </Link>

                <div className="container">

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