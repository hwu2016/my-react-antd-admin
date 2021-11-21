import React, { Component } from 'react'
import {Form, Select, Input} from 'antd'
import PropTypes from 'prop-types'

const {Item} = Form
const {Option} = Select

export default class AddForm extends Component {
    formRef = React.createRef()

    static propTypes = {
        categories: PropTypes.array.isRequired,
        parentId: PropTypes.string.isRequired,
    }

    componentDidUpdate() {
        if (this.formRef.current) {
            this.formRef.current.resetFields();
        }
    }

    render() {
        const {categories, parentId} = this.props
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
                <Item initialValue={parentId} name='parentId'>
                    <Select>
                        <Option key='0' value='0'>一级分类</Option>
                        {
                            categories.map(item => <Option key={item._id} value={item._id}>{item.name}</Option>)
                        }
                    </Select>
                </Item>
                <Item initialValue={''} name='categoryName' rules={rules}>
                    <Input placeholder='请输入需要添加的分类'></Input>
                </Item>
            </Form>
        )
    }
}
