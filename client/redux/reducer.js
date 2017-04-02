import {GET_COMMENTS_REQUEST, GET_COMMENTS_SUCCESS, START_WRITING_ANSWER,
        SAVE_COMMENT_SUCCESS, SAVE_COMMENT_REQUEST} from './actions'
import {ROOT_KEY} from '../utils'

export const initialState = {
    answering: undefined,
    waitingAccept: undefined,
    comments: {},
    children: {},
    loading: undefined
};

export function commentReducer(state=initialState, action) {
    /**
     * Reducer for whole comments app
     */
    if (action){
        switch (action.type){
            case GET_COMMENTS_REQUEST:
                /* mark corresponding parent comment (or root) as loading */
                return {... state, loading:action.payload};


            case GET_COMMENTS_SUCCESS:
                /* add loaded comments to store and update parent-child relations*/
                return {... state,
                    loading: false,
                    comments: Object.assign({}, state.comments, action.payload.pairs),
                    children: Object.assign({}, state.children, action.payload.children),
                };


            case START_WRITING_ANSWER:
                /* show comment form*/
                return {... state, answering: action.payload};


            case SAVE_COMMENT_REQUEST:
                /* send new comment to server, show spinner while server is handling request */
                return {... state, answering: undefined, waitingAccept: state.answering};


            case SAVE_COMMENT_SUCCESS:
                /* put new comment into the tree */
                let children_update = {};
                let parent = action.payload.parent_comment || ROOT_KEY;
                children_update[parent] =
                    (state.children[parent]) ?
                        state.children[parent].concat(action.payload.id)
                        : [action.payload.id];
                let comments_update = {};
                comments_update[action.payload.id] = action.payload;
                return {... state,
                    waitingAccept: undefined,
                    comments: Object.assign({}, state.comments, comments_update),
                    children: Object.assign({}, state.children, children_update)
                }
        }
    }
    return state
}
