import React, { Component } from 'react'
import {Form, Input} from 'antd'

const {Item} = Form

export default class AddForm extends Component {
    formRef = React.createRef()
    
    componentDidUpdate() {
        if (this.formRef.current) {
            this.formRef.current.resetFields();
        }
    }

    render() {
        const rules = [{
            required: true,
            message: '输入内容不可为空'
        }, {
            whitespace: true,
            message: '输入内容不可全为空格'
        },
        ]
        return (
            <Form ref={this.formRef}>
                <Item initialValue={''} name='role' rules={rules}>
                    <Input placeholder='请输入需要添加的角色'></Input>
                </Item>
            </Form>
        )
    }
}