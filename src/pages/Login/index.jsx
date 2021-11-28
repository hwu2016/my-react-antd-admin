import React, { Component } from 'react'
import { Layout, Button, Form, Input, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { reqLogin } from '../../api'
import { Navigate } from 'react-router-dom';
import './index.css'
import storageUtils from '../../utils/storageUtils';
import memoryUtils from '../../utils/memoryUtils';
import {v_username, v_password} from '../../utils/formValidate'

export default class Login extends Component {
  state = {
    user: null,
  }

  componentDidMount(){
    const {user} = memoryUtils
    if (user && user._id) {
      this.setState({user: user})
    }
  }

  render() {
    const { Header, Content, Footer } = Layout

    const NormalLoginForm = () => {
      const onFinish = async (values) => {
        //请求登陆
        const { username, password} = values
        const response = await reqLogin(username, password)
        const { status, user ,msg} = response.data
        if (status === 0) {
          message.success('登陆成功，欢迎' + user.username)
          memoryUtils.user = user
          storageUtils.saveUser(user)
          this.setState({ user: user })
        } else {
          message.error(msg)
        }
      };

      return (
        <Form
          name="normal_login"
          className="login-form"
          validateTrigger='onBlur'
          onFinish={onFinish}
        >
          <h3 style={{ textAlign: 'center', lineHeight: '50px' }}>用户登录</h3>
          <Form.Item
            name="username"
            validateFirst
            rules={v_username}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            validateFirst
            rules={v_password}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登陆
            </Button>
          </Form.Item>
          <Form.Item>
            <i style={{color: 'gray'}}>测试模式：请使用admin/admin登陆</i>
          </Form.Item>
        </Form>
      );
    };

    return (
      <div>
        {this.state.user && (
          <Navigate to='/home' replace={true} />
        )}
        <Layout>
          <Header style={{ color: 'white', backgroundColor: '#59064a' }}>商品后台管理系统</Header>
          <Content style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 137px)', }}>
            <div className="login_container">
              <NormalLoginForm />
            </div>
          </Content>
          <Footer>&copy;Copyright 2021 Ryan Wu</Footer>
        </Layout>
      </div>
    )
  }
}
