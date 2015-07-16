import React from 'react';
import getDisplayName from 'redux/lib/utils/getDisplayName.js';
import { connect } from 'redux/react';
import shallowEqual from 'react/lib/shallowEqual.js';
import Promise from './Promise.js';

class Loading extends React.Component {
    render() {
        return (
            <div className="spinner">
                <div className="bounce1"></div>
                <div className="bounce2"></div>
                <div className="bounce3"></div>
            </div>
        );
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
                this.counter = 0;
                this.state = {
                    loading: false
                };
                ['load', 'isStateReady'].forEach(f => this[f] = this[f].bind(this));
            }

            load(props) {
                const { dispatch, getState } = this.context.redux;
                this.counter++;
                this.setState({
                    loading: true
                });

                getPromise(dispatch, props, getState).then(() => {
                    this.counter--;
                    if (!this.counter) {
                        if (!this.isStateReady(props)) {
                            throw new Error('State not ready even after loading!');
                        }
                        this.setState({
                            loading: false
                        });
                    }
                });
            }

            isStateReady(props) {
                const { getState } = this.context.redux;
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
                if (!this.isStateReady(this.props)) {
                    this.setState({
                        loading: true
                    });
                }
            }

            componentDidMount() {
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