import React, { Component } from 'react'
import Home from '../../pages/Admin/Home'
import Category from '../../pages/Admin/Category'
import Product from '../../pages/Admin/Product'
import Permission from '../../pages/Admin/Permission'
import User from '../../pages/Admin/User'
import Charts from '../../pages/Admin/Charts'
import { Route, Routes, Navigate } from 'react-router-dom'
import { Layout, Breadcrumb } from 'antd'


const { Content } = Layout;

export default class Inner extends Component {
    render() {
        return (
            <Content style={{ margin: '0 16px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>User</Breadcrumb.Item>
                    <Breadcrumb.Item>Bill</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                    <Routes>
                        <Route path='/home' element={<Home />} />
                        <Route path='/category' element={<Category />} />
                        <Route path='/product' element={<Product />} />
                        <Route path='/permission' element={<Permission />} />
                        <Route path='/user' element={<User />} />
                        <Route path='/charts' element={<Charts />} />
                        <Route path='/*' element={<Navigate replace to='/home' />} />
                    </Routes>
                </div>
            </Content>
        )
    }
}
