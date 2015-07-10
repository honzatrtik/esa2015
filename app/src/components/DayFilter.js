import React from 'react';
import { Link } from 'react-router';
import cs from 'react-classset';
import moment from 'moment';
moment.locale('en');

export default class DayFilter extends React.Component {

    static propTypes = {
        dates: React.PropTypes.array.isRequired,
        query: React.PropTypes.object,
    };

    static defaultProps = { query: {} };

    render() {
        const { dates, activeDate, showTba } = this.props;

        let lis = dates.map(date => <li key={date} className={cs({ active: date == activeDate})}><Link to={`/sessions/${date}`} query={this.props.query}>{moment(date).format('ddd D. M.')}</Link></li>);
        if (showTba) {
            lis.push(<li key="tba" className={cs({ active: 'tba' == activeDate})}><Link to={`/sessions/tba`} query={this.props.query}><abbr title="To be announced">tba</abbr></Link></li>)
        }

        return (
            <ul className="nav nav-pills">
                {lis}
            </ul>
        );
    }
}