import React from 'react';
import { Link, State } from 'react-router';
import cs from 'react-classset';
import moment from 'moment';
moment.locale('en');
import reactMixin from 'react-mixin';

@reactMixin.decorate(State)
export default class Menu extends React.Component {

    static defaultProps = { query: {} };

    constructor(props) {
        super(props);
        ['isActive'].forEach(f => this[f] = this[f].bind(this));
    }

    render() {
        const { } = this.props;

        return (
            <ul className="nav nav-pills">
                <li className={cs({ active: this.isActive('/sessions') })}><Link to={'/'}>Programme by date</Link></li>
                <li className={cs({ active: this.isActive('/index') })}><Link to={'/index'}>Index of participants</Link></li>
                <li className={cs({ active: this.isActive('/rooms') })}><Link to={'/rooms'}>Index of rooms</Link></li>
            </ul>
        );
    }
}