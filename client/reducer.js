import {GET_COMMENTS_REQUEST, GET_COMMENTS_SUCCESS} from './actions'
import {getResourceUrl} from './utils'

export const initialState = {
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
                return {
                    loading: false,
                    comments: Object.assign({}, state.comments, action.payload.pairs),
                    children: Object.assign({}, state.children, action.payload.children),
                }
        }
    }
    return state
}
