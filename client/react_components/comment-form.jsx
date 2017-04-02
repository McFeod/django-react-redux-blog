import React, {Component} from 'react'
import './styles.css'

class CommentForm extends Component {
    onSend(){
        this.props.actions.sendCommentAction(this.input, this.props.data)
    }

    render(){
        return (
            <div className='comment-form'>
                <textarea className='form-control' ref={(input) => this.input = input}></textarea>
                <button onClick={::this.onSend} className='comment-button'>
                    отправить</button>
            </div>
        )
    }
}

export default CommentForm