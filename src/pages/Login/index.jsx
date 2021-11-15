import React, { Component } from 'react'
import { Layout, Button, Form, Input, Checkbox, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { reqLogin } from '../../api'
import { Navigate } from 'react-router';
import './index.css'
import storageUtils from '../../utils/storageUtils';
import memoryUtils from '../../utils/memoryUtils';

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
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <h3 style={{ textAlign: 'center' }}>用户登录</h3>
          <Form.Item
            name="username"
            validateFirst={true}
            rules={[
              { required: true, whitespace: true, message: '请输入用户名!', },
              { min: 4, message: '用户名至少四位!', },
              { max: 12, message: '用户名最多十二位!', },
              { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名由英文数字和下划线组成!', },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            validateFirst={true}
            rules={[
              { required: true, whitespace: true, message: '请输入密码!', },
              { min: 4, message: '密码至少四位!', },
              { max: 12, message: '密码最多十二位!', },
              //自定义验证
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (/^[a-zA-Z0-9_=-]+$/.test(getFieldValue('password')) === true) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('密码由英文数字和下划线组成!'))
                }
              }),
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="密码"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住我</Checkbox>
            </Form.Item>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登陆
            </Button>
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
