import {GET_COMMENTS_REQUEST, GET_COMMENTS_SUCCESS} from './actions'
import {getResourceUrl} from './utils'

export const initialState = {
    comments: {},
    loading: false
};

export function commentReducer(state=initialState, action) {
    if (action){
        switch (action.type){
            case GET_COMMENTS_REQUEST:
                return {... state, loading:true};
            case GET_COMMENTS_SUCCESS:
                return {
                    loading: false,
                    comments: Object.assign({}, state.comments, action.payload)
                }
        }
    }
    return state
}
