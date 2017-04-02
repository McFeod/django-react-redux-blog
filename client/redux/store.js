import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'

export default function configureStore(initialState, rootReducer) {
    return createStore(
        rootReducer,
        initialState,
        applyMiddleware(thunk));
}