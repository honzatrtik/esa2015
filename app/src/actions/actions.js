import * as api from '../api.js';
import constants from '../constants.js'


export function getPresentationAction(dispatch) {
    return (id) => dispatch({
        types: [constants.PRESENTATION_GET_REQUEST, constants.PRESENTATION_GET_SUCCESS, constants.PRESENTATION_GET_ERROR],
        promise: api.getPresentation(id)
    });
}

export function listSessionsAction(dispatch) {
    return (params) => dispatch({
        types: [constants.SESSION_LIST_REQUEST, constants.SESSION_LIST_SUCCESS, constants.SESSION_LIST_ERROR],
        promise: api.listSessions(params)
    });
}

export function listTypesAction(dispatch) {
    return () => dispatch({
        types: [constants.TYPES_LIST_REQUEST, constants.TYPES_LIST_SUCCESS, constants.TYPES_LIST_ERROR],
        promise: api.listTypes()
    });
}