import React, { Component } from 'react'
import { Button, message } from 'antd'

export default class App extends Component {
    handleClick = () => {
        message.success('success!', 3)
    }
    
    render() {
        return (
            <div>
                <Button onClick={this.handleClick} type="primary">Hi</Button>
            </div>
        )
    }
}
