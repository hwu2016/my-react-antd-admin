import React, { Component } from 'react'
import './index.css'
import 'animate.css'
import Canvas from './Canvas'


export default class Home extends Component {
    render() {
        return (
            <div className='home-wrapper'>
                <Canvas/>
                <div className='greet-wrapper'>
                    <p className='greet animate__fadeInDown cn'>欢迎进入后台管理系统</p>
                    <p className='greet animate__fadeInDown en'>Welcome to the Content Management System</p>
                </div>
            </div>
        )
    }
}
