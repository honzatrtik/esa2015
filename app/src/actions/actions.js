import * as api from '../api.js';
import constants from '../constants.js'


export function getPresentationAction(dispatch) {
    return (id) => dispatch({
        types: [constants.PRESENTATION_GET_REQUEST, constants.PRESENTATION_GET_SUCCESS, constants.PRESENTATION_GET_ERROR],
        promise: api.getPresentation(id),
        params: {id}
    });
}

export function getAuthorAction(dispatch) {
    return (hash) => dispatch({
        types: [constants.AUTHOR_GET_REQUEST, constants.AUTHOR_GET_SUCCESS, constants.AUTHOR_GET_ERROR],
        promise: api.getAuthor(hash),
        hash
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

export function listSessionsByAuthorHashAction(dispatch) {
    return (hash) => dispatch({
        types: [constants.SESSION_LIST_BY_AUTHOR_HASH_REQUEST, constants.SESSION_LIST_BY_AUTHOR_HASH_SUCCESS, constants.SESSION_LIST_BY_AUTHOR_HASH_ERROR],
        promise: api.listSessionsByAuthorHash(hash),
        hash
    });
}


export function listTypesAction(dispatch) {
    return () => dispatch({
        types: [constants.TYPES_LIST_REQUEST, constants.TYPES_LIST_SUCCESS, constants.TYPES_LIST_ERROR],
        promise: api.listTypes()
    });
}

export function listFirstCharsAction(dispatch) {
    return () => dispatch({
        types: [constants.FIRST_CHARS_LIST_REQUEST, constants.FIRST_CHARS_LIST_SUCCESS, constants.FIRST_CHARS_LIST_ERROR],
        promise: api.listFirstChars()
    });
}

export function listAuthorsByFirstCharAction(dispatch) {
    return (char) => dispatch({
        types: [constants.AUTHORS_BY_FIRST_CHAR_LIST_REQUEST, constants.AUTHORS_BY_FIRST_CHAR_LIST_SUCCESS, constants.AUTHORS_BY_FIRST_CHAR_LIST_ERROR],
        char,
        promise: api.listAuthorsByFirstChar(char)
    });
}


export function listRoomsAction(dispatch) {
    return () => dispatch({
        types: [constants.ROOMS_LIST_REQUEST, constants.ROOMS_LIST_SUCCESS, constants.ROOMS_LIST_ERROR],
        promise: api.listRooms()
    });
}
