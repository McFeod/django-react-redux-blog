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
                {(this.props.data.has_children && !this.props.data.hasOwnProperty('children')) ?
                    <button onClick={::this.onLoadMore} className='comment-button'>раскрыть ветвь</button>
                    : ''
                }
                <div className='comment-nested'>
                    <CommentList data={this.props.data['children']}/>
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
                    data={item}
                    loadAction={this.props.loadAction}
                    key={item.id}/>
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
        return (
            (this.props.comments['root']) ?
            <CommentList data={this.props.comments[ROOT_KEY]['children']} loadAction={this.props.loadAction}/>
            : <p>Комментариев пока нет</p>
        )
    }
}

function mapState(state) {
    return {
        comments: state.comments
    }
}

function mapDispatch(dispatch) {
    return {
        loadAction: bindActionCreators(loadAction, dispatch)
    }
}

export default connect(mapState, mapDispatch)(CommentTree)