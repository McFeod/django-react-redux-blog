import React, {Component} from 'react'
import FontAwesome from 'react-fontawesome'
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
                {(this.props.data.has_children && !this.props.state.children[this.props.data.id]) ?
                    <button onClick={::this.onLoadMore} className='comment-button'>раскрыть ветвь</button>
                    : ''
                }
                <div className='comment-nested'>
                    {(this.props.state.loading === this.props.data.id) ?
                        <FontAwesome
                            name='spinner'
                            spin/>
                        : <CommentList
                            data={this.props.state.children[this.props.data.id]}
                            state = {this.props.state}
                            loadAction={this.props.loadAction}/>
                    }

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
                    data={this.props.state.comments[item]}
                    state = {this.props.state}
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
            (this.props.state.loading === ROOT_KEY) ?
                <FontAwesome
                    name='spinner'
                    spin/>
                    : (this.props.state.children[ROOT_KEY]) ?
                        <CommentList data={this.props.state.children[ROOT_KEY]}
                                     state = {this.props.state}
                                     loadAction={this.props.loadAction}/>
                        : <p>Комментариев пока нет</p>
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
        loadAction: bindActionCreators(loadAction, dispatch)
    }
}

export default connect(mapState, mapDispatch)(CommentTree)