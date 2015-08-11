import React from 'react';
import { Link } from 'react-router';
import loader from '../createLoaderDecorator.js';
import { listRoomsAction } from '../actions/actions.js';
import config from '../config.js';
import Menu from './Menu';
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
            <DocumentTitle title={['Index of Rooms', ' | ESA 2015 Prague'].join('  ')}>
                <div style={{ opacity: loading ? .4 : 1 }}>

                    <Menu />

                    <h1 key="title">
                        Index of rooms
                    </h1>

                    <div key="rooms">
                        <div className="row">
                            {Object.keys(rooms).map(index => <div className="col-md-3" key={rooms[index]['room_id']}><h4><Link title={'Show programme for room: ' + rooms[index].room}  to={`/rooms/${rooms[index]['room_id']}`}>{rooms[index].room}</Link></h4></div>)}
                        </div>
                    </div>
                </div>
            </DocumentTitle>
        );
    }
}
