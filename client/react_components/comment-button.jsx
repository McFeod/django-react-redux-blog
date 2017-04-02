import React, {Component} from 'react'
import FontAwesome from 'react-fontawesome'
import CommentForm from './comment-form.jsx'
import './styles.css'


export default class CommentButton extends Component{
    onStartWriting(){
        this.props.actions.showCommentForm(this.props.data.id)
    }

    render() {
        return (this.props.state.answering === this.props.data.id)
            ?
            <CommentForm data={this.props.data}
                         actions={this.props.actions}/>
            : (this.props.state.waitingAccept === this.props.data.id)
                ?
                <div className='spinner-wrapper'><FontAwesome name='gear' spin/></div>
                :
                <button className='comment-button' onClick={::this.onStartWriting}>
                    комментировать</button>
    }
}