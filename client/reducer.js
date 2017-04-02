import {GET_COMMENTS_REQUEST, GET_COMMENTS_SUCCESS, START_WRITING_ANSWER,
        SAVE_COMMENT_SUCCESS, SAVE_COMMENT_REQUEST} from './actions'

export const initialState = {
    answering: undefined,
    waitingAccept: undefined,
    comments: {},
    children: {},
    loading: undefined
};

export function commentReducer(state=initialState, action) {
    if (action){
        switch (action.type){
            case GET_COMMENTS_REQUEST:
                return {... state, loading:action.payload};
            case GET_COMMENTS_SUCCESS:
                return {... state,
                    loading: false,
                    comments: Object.assign({}, state.comments, action.payload.pairs),
                    children: Object.assign({}, state.children, action.payload.children),
                };
            case START_WRITING_ANSWER:
                return {... state, answering: action.payload};
            case SAVE_COMMENT_REQUEST:
                return {... state, answering: undefined, waitingAccept: state.answering};
            case SAVE_COMMENT_SUCCESS:
                return {... state,
                    waitingAccept: undefined,
                    // todo
                    comments: Object.assign({}, state.comments, action.payload.pairs),
                    children: Object.assign({}, state.children, action.payload.children)
                }
        }
    }
    return state
}
