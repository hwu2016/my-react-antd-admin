import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input } from 'antd'

const { Item } = Form

export default class UpdateForm extends Component {
    formRef = React.createRef()

    static propTypes = {
        categoryName: PropTypes.string.isRequired,
    }

    componentDidUpdate() {
        if (this.formRef.current) {
            this.formRef.current.resetFields();
        }
    }

    render() {
        const { categoryName } = this.props
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
                <Item initialValue={categoryName} name="categoryName" rules={rules}>
                    <Input allowClear placeholder='请输入更新的分类名'></Input>
                </Item>
            </Form>
        )
    }
}
