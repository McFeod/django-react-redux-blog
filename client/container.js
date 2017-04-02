import React, {Component} from 'react'
import FontAwesome from 'react-fontawesome'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {loadAction, sendCommentAction, showCommentForm} from './actions'
import {ROOT_KEY} from './utils'
import './styles.css'


class CommentForm extends Component {
    onSend(){
        this.props.actions.sendCommentAction(this.props.data, this.input) //todo
    }


    render(){
        return (
            <div className='comment-form'>
                <textarea className='form-control' ref={(input) => this.input = input}></textarea>
                <button onClick={::this.onSend} className='comment-button'>
                    ответить</button>
            </div>
        )
    }
}

class CommentButton extends Component{
    onStartWriting(){
        this.props.actions.showCommentForm(this.props.data.id)
    }

    render() {
        return (this.props.state.answering === this.props.data.id) ?
            <CommentForm data={this.props.data}
                         actions={this.props.actions}/>
            : (this.props.state.waitingAccept === this.props.data.id) ?
                <div className='spinner-wrapper'><FontAwesome name='gear' spin/></div>
                : <button className='comment-button' onClick={::this.onStartWriting}>
                    комментировать</button>
    }
}

class Comment extends Component {
    onLoadMore(){
        if (this.props.data.has_children){
            this.props.actions.loadAction({
                level__gt: this.props.data.level,
                max_unfold_comment: this.props.data.max_unfold_comment
            })
        }
    }

    render(){
        return (
            <div className='comment-container'>
                <p className='comment-header'>
                    {this.props.data.author.username || 'username'}
                    <span>
                        {this.props.data.created_at || 'datetime'}
                    </span>
                </p>
                <p className='comment-content'>{this.props.data.content || 'comment' } </p>

                {(this.props.data.has_children && !this.props.state.children[this.props.data.id]) ?
                    <button onClick={::this.onLoadMore} className='comment-button'>
                        раскрыть ветвь</button>
                    : <CommentButton
                        data={this.props.data}
                        state = {this.props.state}
                        actions={this.props.actions}
                    />
                }

                <div className='comment-nested'>
                    {(this.props.state.loading === this.props.data.id) ?
                        <FontAwesome name='spinner' spin/>
                        : <CommentList
                            data={this.props.state.children[this.props.data.id]}
                            state = {this.props.state}
                            actions={this.props.actions}/>
                    }

                </div>
            </div>
        )
    }
}


class CommentList extends Component {
    render(){
        return <div>{
            (this.props.data) ?
            this.props.data.map(item => {
                return <Comment
                    data={this.props.state.comments[item]}
                    state = {this.props.state}
                    actions={this.props.actions}
                    key={item}/>
            })
            : ''
        }</div>
    }
}



class CommentTree extends Component{
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
            <div className='comment-tree'>{
                (this.props.state.loading === ROOT_KEY) ?
                    <FontAwesome name='spinner' spin/>
                    : (this.props.state.children[ROOT_KEY]) ?
                        <CommentList data={this.props.state.children[ROOT_KEY]}
                                     state={this.props.state}
                                     actions={this.props.actions}/>
                        : <p>Комментариев пока нет</p>
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