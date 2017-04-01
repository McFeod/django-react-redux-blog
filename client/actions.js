import axios from 'axios'
import {getResourceUrl, makeRelations, ROOT_KEY} from './utils'

export const GET_COMMENTS_REQUEST = 'GET_COMMENTS_REQUEST';
export const GET_COMMENTS_SUCCESS = 'GET_COMMENTS_SUCCESS';
export const GET_COMMENTS_FAILURE = 'GET_COMMENTS_FAILURE';

export function loadAction(params) {
    return (dispatch) => {
        dispatch({
            type: GET_COMMENTS_REQUEST,
            payload: params.max_unfold_comment || ROOT_KEY
        });

        axios.get(getResourceUrl(params)).then((response) => {
            dispatch({
                type: GET_COMMENTS_SUCCESS,
                payload: makeRelations(response.data.objects,
                    params.max_unfold_comment || ROOT_KEY),
            })
        })
    }
}