import React, { Component } from 'react'
import Home from '../../pages/Admin/Home'
import Category from '../../pages/Admin/Category'
import Product from '../../pages/Admin/Product'
import Permission from '../../pages/Admin/Permission'
import User from '../../pages/Admin/User'
import Charts from '../../pages/Admin/Charts'
import NotFound from '../../pages/Admin/NotFound'
import TopNav from './TopNav'
import { Route, Routes, Navigate } from 'react-router-dom'
import { Layout } from 'antd'


const { Content } = Layout;

export default class Inner extends Component {
    render() {
        return (
            <Content style={{ margin: '0 16px' }}>
                <TopNav />
                <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                    <Routes>
                        <Route path='/home' element={<Home />} />
                        <Route path='/category' element={<Category />} />
                        <Route path='/product/*' element={<Product />} />
                        <Route path='/permission' element={<Permission />} />
                        <Route path='/user' element={<User />} />
                        <Route path='/charts' element={<Charts />} />
                        <Route path='/' element={<Navigate replace to='/home'/>}/>
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
            </Content>
        )
    }
}
