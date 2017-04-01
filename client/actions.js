import axios from 'axios'
import {getResourceUrl, makeTree, getParent} from './utils'

export const GET_COMMENTS_REQUEST = 'GET_COMMENTS_REQUEST';
export const GET_COMMENTS_SUCCESS = 'GET_COMMENTS_SUCCESS';
export const GET_COMMENTS_FAILURE = 'GET_COMMENTS_FAILURE';

export function loadAction(params) {
    return (dispatch) => {
        dispatch({
            type: GET_COMMENTS_REQUEST
        });
        axios.get(getResourceUrl(params)).then((response) => {
            dispatch({
                type: GET_COMMENTS_SUCCESS,
                payload: makeTree(getParent(params), response.data.objects),
            })
        })
    }
}