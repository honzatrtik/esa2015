import React from 'react';
import { getTypes } from '../api.js';

export default class App extends React.Component {

    render() {

        return (
            <div>
                <div id="header">
                    <h1>ESA 2015 Prague - Conference Programme</h1>
                </div>

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