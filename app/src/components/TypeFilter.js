import React from 'react';
import { Link, Navigation } from 'react-router';
import cs from 'react-classset';
import moment from 'moment';
import reactMixin from 'react-mixin';
moment.locale('en');

@reactMixin.decorate(Navigation)
export default class TypeFilter extends React.Component {

    static propTypes = {
        types: React.PropTypes.array.isRequired,
        activeType: React.PropTypes.string,
        query: React.PropTypes.object,
        pathname: React.PropTypes.string.isRequired
    };

    static defaultProps = { query: {} };

    constructor(props) {
        super(props);
        ['handleChange'].forEach(f => this[f] = this[f].bind(this));
    }

    handleChange(event) {
        let { pathname, query } = this.props;
        this.transitionTo(pathname, {
            ...query,
            type: event.target.value
        });
    }

    render() {
        const { types, query, activeType } = this.props;
        return (
            <div className="form-horizontal row">
                <label className="control-label col-md-4">RN/RS</label>
                <div className="col-md-8">
                    <select onChange={this.handleChange} className="form-control" value={activeType || ''}>
                        <option value={''}>all</option>
                        {types.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
            </div>
        );
    }
}