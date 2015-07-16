import * as api from '../api.js';
import constants from '../constants.js'


export function getPresentationAction(dispatch) {
    return (id) => dispatch({
        types: [constants.PRESENTATION_GET_REQUEST, constants.PRESENTATION_GET_SUCCESS, constants.PRESENTATION_GET_ERROR],
        promise: api.getPresentation(id),
        params: {id}
    });
}

export function listSessionsByDateAction(dispatch) {
    return (date, query) => dispatch({
        types: [constants.SESSION_LIST_BY_DATE_REQUEST, constants.SESSION_LIST_BY_DATE_SUCCESS, constants.SESSION_LIST_BY_DATE_ERROR],
        promise: api.listSessionsByDate(date, query),
        date,
        query
    });
}

export function listSessionsByRoomIdAction(dispatch) {
    return (roomId) => dispatch({
        types: [constants.SESSION_LIST_BY_ROOM_ID_REQUEST, constants.SESSION_LIST_BY_ROOM_ID_SUCCESS, constants.SESSION_LIST_BY_ROOM_ID_ERROR],
        promise: api.listSessionsByRoomId(roomId),
        roomId
    });
}


export function listTypesAction(dispatch) {
    return () => dispatch({
        types: [constants.TYPES_LIST_REQUEST, constants.TYPES_LIST_SUCCESS, constants.TYPES_LIST_ERROR],
        promise: api.listTypes()
    });
}

export function listRoomsAction(dispatch) {
    return () => dispatch({
        types: [constants.ROOMS_LIST_REQUEST, constants.ROOMS_LIST_SUCCESS, constants.ROOMS_LIST_ERROR],
        promise: api.listRooms()
    });
}
