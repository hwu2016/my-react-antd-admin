import React, { Component } from 'react'
import { Layout } from 'antd';
import storageUtils from '../../utils/storageUtils'
import { reqWeather } from '../../api/index'
import './index.css'

const { Header } = Layout;

export default class Head extends Component {
    state = {
        weather: '',
        temp: 0,
        city: ''
    }

    componentDidMount(){
        this.getWeather()
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

    render() {
        const {username} = storageUtils.getUser()
        const {weather, temp, city} = this.state
        return (
            <Header className="site-layout-background" style={{ padding: 0 }} >
                <div className="head-welcome">
                    <span className="welcome">欢迎你，{username}</span>
                    <a href="#;">注销</a>
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
