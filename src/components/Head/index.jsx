import React, { Component } from 'react'
import { Layout } from 'antd';
import storageUtils from '../../utils/storageUtils'
import { reqWeather } from '../../api/index'
import { Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Navigate } from 'react-router-dom';
import './index.css'
import memoryUtils from '../../utils/memoryUtils';

const { Header } = Layout;

export default class Head extends Component {
    state = {
        weather: '',
        temp: 0,
        city: '',
        isLogOut: false,
    }

    getWeather = async () => {
        const city = '上海'
        const [weather, temp] = await reqWeather(city)
        this.setState({
            weather: weather,
            temp: temp,
            city: city,
        })
    }

    logOut = () => {
        Modal.confirm({
            title: '确认要注销吗?',
            icon: <ExclamationCircleOutlined />,
            content: '注销后需要重新输入用户名和密码才能再次登陆',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                storageUtils.removeUser()
                memoryUtils.user = {}
                this.setState({ isLogOut: true })
            },
        })
    }

    componentDidMount() {
        this.getWeather()
    }


    render() {
        const { username } = storageUtils.getUser()
        const { weather, temp, city, isLogOut } = this.state
        return (
            <Header className="site-layout-background" style={{ padding: 0 }} >
                {isLogOut &&
                    (<Navigate to='/login' replace={true} />)
                }
                <div className="head-welcome">
                    <span className="welcome">欢迎你，{username}</span>
                    <Button type='link' onClick={this.logOut}>注销</Button>
                </div>
                <div className="head-weather">
                    <span>{weather}</span>
                    <span>{temp}&#8451;</span>
                    <span>{city}</span>
                </div>
            </Header>
        )
    }
}
