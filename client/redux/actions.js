import axios from 'axios'
import {getResourceUrl, makeRelations, ROOT_KEY, getCookie} from '../utils'

export const GET_COMMENTS_REQUEST = 'GET_COMMENTS_REQUEST';
export const GET_COMMENTS_SUCCESS = 'GET_COMMENTS_SUCCESS';
export const START_WRITING_ANSWER = 'START_WRITING_ANSWER';
export const SAVE_COMMENT_REQUEST = 'SAVE_COMMENT_REQUEST';
export const SAVE_COMMENT_SUCCESS = 'SAVE_COMMENT_SUCCESS';

export function loadAction(params) {
    /**
     * Loading comments from server.
     * @param params - applicable filters
     */
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
    /**
     * @param commentId - id of comment where form will be shown
     */
    return (dispatch) =>
        dispatch({
            type: START_WRITING_ANSWER,
            payload: commentId
        })
}

export function sendCommentAction(commentText, parentComment) {
    /**
     * Sending new comment to server
     */
    return (dispatch) => {
        dispatch({
            type: SAVE_COMMENT_REQUEST,
            payload: parentComment.id
        });

        // for Django CSRF protection
        axios.defaults.headers.common['X-CSRFToken'] = getCookie('csrftoken');
        const params = {
            content: commentText.value,
            parent_comment: parentComment.id === ROOT_KEY ? null : parentComment.id,
            article: parentComment.article,
        };
        axios.post('/api/v1/comments/', params).then((response) => {
            dispatch({
                type: SAVE_COMMENT_SUCCESS,
                payload: response.data,
            })
        })
    }
}