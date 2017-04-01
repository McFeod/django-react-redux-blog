import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'

import configureStore from './store'
import {initialState, commentReducer} from  './reducer'
import CommentTree from './container'

const store = configureStore(initialState, commentReducer);

ReactDOM.render(
    <Provider store={store}>
        <CommentTree />
    </Provider>,
    document.getElementById('comments')
);