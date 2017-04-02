import axios from 'axios'
import {getResourceUrl, makeRelations, ROOT_KEY, getArticleId, getCookie} from './utils'

export const GET_COMMENTS_REQUEST = 'GET_COMMENTS_REQUEST';
export const GET_COMMENTS_SUCCESS = 'GET_COMMENTS_SUCCESS';
export const START_WRITING_ANSWER = 'START_WRITING_ANSWER';
export const SAVE_COMMENT_REQUEST = 'SAVE_COMMENT_REQUEST';
export const SAVE_COMMENT_SUCCESS = 'SAVE_COMMENT_SUCCESS';

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

export function showCommentForm(commentId) {
    return (dispatch) =>
        dispatch({
            type: START_WRITING_ANSWER,
            payload: commentId
        })
}

export function sendCommentAction(commentId, newComment) {
    return (dispatch) => {
        dispatch({
            type: SAVE_COMMENT_REQUEST,
            payload: commentId
        });

        axios.defaults.headers.common['X-CSRFToken'] = getCookie('csrftoken');
        const params = {
            content: newComment.value,
            parent_comment: commentId,
            article: +getArticleId(),
        };
        axios.post('/api/v1/comments/', params).then((response) => {
            dispatch({
                type: SAVE_COMMENT_SUCCESS,
                payload: response.data,
            })
        })
    }
}