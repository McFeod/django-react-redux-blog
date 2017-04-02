import React, {Component} from 'react'
import Comment from './comment.jsx'


export default class CommentList extends Component {
    render(){
        return <div>{
            (this.props.data)
                ?
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
