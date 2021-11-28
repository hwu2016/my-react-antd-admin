import React, { Component } from 'react'
import { Form, Select, Input } from 'antd'
import PropTypes from 'prop-types'
import { v_email, v_password, v_username, v_tel } from '../../../../utils/formValidate'

const { Item } = Form
const { Option } = Select
const { Password } = Input

export default class AddUpdate extends Component {
    formRef = React.createRef()

    static propTypes = {
        roles: PropTypes.array.isRequired,
        user: PropTypes.object
    }

    componentDidUpdate() {
        if (this.formRef.current) {
            this.formRef.current.resetFields();
        }
    }

    render() {
        const { roles, user } = this.props
        const { username, email, phone, role_id, password } = user
        return (
            <Form
                validateTrigger='onBlur'
                ref={this.formRef}
                wrapperCol={{ span: 10 }}
                labelCol={{ span: 5 }}
                initialValues={{
                    username,
                    email,
                    phone,
                    role_id,
                    password
                }}
            >
                <Item
                    label='用户名'
                    validateFirst
                    rules={v_username}
                    name='username'
                >
                    <Input placeholder='请输入用户名' />
                </Item>
                <Item
                    label='密码'
                    validateFirst
                    rules={v_password}
                    name='password'
                >
                    <Password
                        placeholder='请输入密码'
                        type='password'
                        visibilityToggle={user.password ? false : true}
                        disabled={user.password ? true : false}
                    />
                </Item>
                <Item
                    label='手机号'
                    rules={v_tel}
                    name='phone'
                >
                    <Input placeholder='请输入手机号' type='tel' />
                </Item>
                <Item
                    label='邮箱'
                    rules={v_email}
                    name='email'
                >
                    <Input placeholder='请输入邮箱' type='email' />
                </Item>
                <Item
                    label='权限角色'
                    name='role_id'
                >
                    <Select>
                        {
                            roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                        }
                    </Select>
                </Item>
            </Form>
        )
    }
}
