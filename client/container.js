import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {loadAction} from './actions'
import {ROOT_KEY} from './utils'
import './styles.css'

class Comment extends Component {
    onLoadMore(){
        if (this.props.data.has_children){
            this.props.loadAction({
                level__gt: this.props.data.level,
                max_unfold_comment: this.props.data.max_unfold_comment
            })
        }
    }

    render(){
        console.log('render comment');
        return (
            <div className='comment-container'>
                <p className='comment-header'>
                    {this.props.data.author.username || 'username'}
                    <span>
                        {this.props.data.created_at || 'datetime'}
                    </span>
                </p>
                <p className='comment-content'>{this.props.data.content || 'comment' } </p>
                <button className='comment-button'>комментировать</button>
                {(this.props.data.has_children && !this.props.children[this.props.data.id]) ?
                    <button onClick={::this.onLoadMore} className='comment-button'>раскрыть ветвь</button>
                    : ''
                }
                <div className='comment-nested'>
                    <CommentList
                        data={this.props.children[this.props.data.id]}
                        children = {this.props.children}
                        comments = {this.props.comments}
                        loadAction={this.props.loadAction}/>
                </div>
            </div>
        )
    }
}


class CommentList extends Component {
    render(){
        console.log('render list');
        return <div>{
            (this.props.data) ?
            this.props.data.map(item => {
                return <Comment
                    data={this.props.comments[item]}
                    children = {this.props.children}
                    comments = {this.props.comments}
                    loadAction={this.props.loadAction}
                    key={item}/>
            })
            : ''
        }</div>
    }
}



class CommentTree extends Component{
    onLoadMore(){
        this.props.loadAction({
            level__lte: 3
        })
    }

    componentDidMount(){
        this.onLoadMore()
    }

    render(){
        console.log('render tree');
        return (
            (this.props.children[ROOT_KEY]) ?
            <CommentList data={this.props.children[ROOT_KEY]}
                         children = {this.props.children}
                         comments = {this.props.comments}
                         loadAction={this.props.loadAction}/>
            : <p>Комментариев пока нет</p>
        )
    }
}

function mapState(state) {
    return {
        comments: state.comments,
        children: state.children
    }
}

function mapDispatch(dispatch) {
    return {
        loadAction: bindActionCreators(loadAction, dispatch)
    }
}

export default connect(mapState, mapDispatch)(CommentTree)