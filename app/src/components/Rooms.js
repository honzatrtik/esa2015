import React from 'react';
import { Link } from 'react-router';
import loader from '../createLoaderDecorator.js';
import { listRoomsAction } from '../actions/actions.js';
import config from '../config.js';
import DocumentTitle from 'react-document-title';
import moment from 'moment';
moment.locale('en');

@loader(
    (dispatch, props, getState) => {
        return listRoomsAction(dispatch)();
    },
    (state, props) => {
        return {
            rooms: state.rooms,
        };
    },
    (state, props) => {
        return state.rooms
    }
)
export default class Rooms extends React.Component {

    static propTypes = {
        rooms: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        [].forEach(f => this[f] = this[f].bind(this));
    }

    render() {

        const { location, rooms, params, loading } = this.props;

        return (
            <DocumentTitle title={['Programme by room', ' | ESA 2015 Prague'].join('  ')}>
                <div style={{ opacity: loading ? .4 : 1 }}>

                    <h1 key="title">
                        Programme by room
                    </h1>

                    <div key="rooms">
                        <div className="row">
                            {Object.keys(rooms).map(roomId => <div className="col-md-3" key={roomId}><h4><Link title={'Show programme for room: ' + rooms[roomId].room}  to={`/room/${roomId}`}>{rooms[roomId].room}</Link></h4></div>)}
                        </div>
                    </div>
                </div>
            </DocumentTitle>
        );
    }
}
