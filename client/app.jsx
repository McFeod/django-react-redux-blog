import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'

import configureStore from './redux/store'
import {initialState, commentReducer} from  './redux/reducer'
import CommentTree from './react_components/comment-tree.jsx'

const store = configureStore(initialState, commentReducer);

ReactDOM.render(
    <Provider store={store}>
        <CommentTree />
    </Provider>,
    document.getElementById('comments')
);