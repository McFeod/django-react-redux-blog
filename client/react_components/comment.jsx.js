import React, {Component} from 'react'
import FontAwesome from 'react-fontawesome'
import CommentButton from './comment-button.jsx'
import CommentList from './comment-list.jsx'
import './styles.css'


export default class Comment extends Component {
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

                {(this.props.data.has_children && !this.props.state.children[this.props.data.id])
                    ?
                    <button onClick={::this.onLoadMore} className='comment-button'>
                        раскрыть ветвь</button>
                    :
                    <CommentButton
                        data={this.props.data}
                        state = {this.props.state}
                        actions={this.props.actions}
                    />
                }

                <div className='comment-nested'>
                    {(this.props.state.loading === this.props.data.id)
                        ?
                        <FontAwesome name='spinner' spin/>
                        :
                        <CommentList
                            data={this.props.state.children[this.props.data.id]}
                            state = {this.props.state}
                            actions={this.props.actions}/>
                    }

                </div>
            </div>
        )
    }
}
