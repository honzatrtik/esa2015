import React from 'react';
import getDisplayName from 'redux/lib/utils/getDisplayName.js';
import { connect } from 'redux/react';
import shallowEqual from 'react/lib/shallowEqual.js';
import Promise from './Promise.js';

class Loading extends React.Component {
    render() {
        return <div>Loading</div>;
    }
}

export default function loader(getPromise, select, stateReady) {
    return DecoratedComponent => {
        DecoratedComponent = connect(select)(DecoratedComponent);
        return class LoaderDecorator extends React.Component {

            static contextTypes = {
                redux: React.PropTypes.object.isRequired
            };

            static displayName = `Loader(${getDisplayName(DecoratedComponent)})`;
            static DecoratedComponent = DecoratedComponent;
            static getPromise = getPromise;

            constructor(props) {
                super(props);
                this.state = {
                    loading: false
                };
                ['load', 'isStateReady'].forEach(f => this[f] = this[f].bind(this));
            }

            load(props) {
                const { dispatch, getState } = this.context.redux;
                this.setState({
                    loading: true
                });
                getPromise(dispatch, props, getState).then(() => {

                    if (!this.isStateReady(props)) {
                        throw new Error('State not ready even after loading!');
                    }
                    this.setState({
                        loading: false
                    });
                });
            }

            isStateReady(props) {
                const { dispatch, getState } = this.context.redux;
                return typeof stateReady === 'function' && stateReady(getState(), props)
            }

            componentWillReceiveProps(nextProps) {

                const ok = shallowEqual(this.props.location, nextProps.location)
                    && shallowEqual(this.props.location.query, nextProps.location.query);

                if (!ok || !this.isStateReady(nextProps)) {
                    this.setState({
                        oldProps: this.props
                    });
                    this.load(nextProps);
                }
            }

            componentWillMount() {
                debugger;
                if (!this.isStateReady(this.props)) {
                    this.setState({
                        loading: true
                    });
                }
            }

            componentDidMount() {
                debugger;
                if (!this.isStateReady(this.props)) {
                    this.load(this.props);
                }
            }

            render() {

                if (this.state.loading) {
                    const { oldProps } = this.state;
                    if (this.state.oldProps) {

                        const props = {
                            ...oldProps,
                            loading: true
                        };
                        return  <DecoratedComponent { ...props } />;
                    } else {
                        return <Loading />;
                    }
                }

                return <DecoratedComponent {...this.props} />;
            }
        }
    }
}