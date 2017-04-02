import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import FontAwesome from 'react-fontawesome'
import CommentList from './comment-list.jsx'
import CommentButton from './comment-button.jsx'
import {loadAction, sendCommentAction, showCommentForm} from '../redux/actions'
import {ROOT_KEY, getArticleId} from '../utils'
import './styles.css'


class CommentTree extends Component{
    /**
     * Root comment component
     */
    onLoadMore(){
        this.props.actions.loadAction({
            level__lte: 3
        })
    }

    componentDidMount(){
        this.onLoadMore()
    }

    render(){
        return (
            <div className='comment-tree'>
                <div className='root-button'>
                    <CommentButton
                        data={{
                            article: '/api/v1/articles/' + getArticleId() + '/',
                            id: ROOT_KEY
                        }}
                        state={this.props.state}
                        actions={this.props.actions}/>
                </div>
                {(this.props.state.loading === ROOT_KEY)
                    ?
                    <FontAwesome name='spinner' spin/>
                    :
                    (this.props.state.children[ROOT_KEY])
                        ?
                        <CommentList data={this.props.state.children[ROOT_KEY]}
                                     state={this.props.state}
                                     actions={this.props.actions}/>
                        :
                        <p>Комментариев пока нет</p>
                }
            </div>
        )
    }
}

function mapState(state) {
    return {
        state: state
    }
}

function mapDispatch(dispatch) {
    return {
        actions: bindActionCreators({
            loadAction,
            sendCommentAction,
            showCommentForm
        }, dispatch)
    }
}

export default connect(mapState, mapDispatch)(CommentTree)