import React, { Component } from 'react'
import { Navigate } from 'react-router-dom'
import memoryUtils from '../../utils/memoryUtils'
import { Layout, Breadcrumb } from 'antd';
import { Route, Routes} from 'react-router-dom'
import LeftNav from '../../components/LeftNav';
import Home from '../Admin/Home'
import Category from '../Admin/Category'
import Product from '../Admin/Product'
import Permission from '../Admin/Permission'
import User from '../Admin/User'
import Charts from '../Admin/Charts'
import './index.css'

const { Header, Content, Footer } = Layout;

export default class Admin extends Component {

    render() {
        const { user } = memoryUtils

        if (!user || !user._id) {
            return <Navigate to='/login' replace={true} /> 
        }
    
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <LeftNav/>
                <Layout className="site-layout">
                    <Header className="site-layout-background" style={{ padding: 0 }} />
                    <Content style={{ margin: '0 16px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item>User</Breadcrumb.Item>
                            <Breadcrumb.Item>Bill</Breadcrumb.Item>
                        </Breadcrumb>
                        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                            <Routes>
                                <Route path='/home' element={<Home/>}/>
                                <Route path='/category' element={<Category/>}/>
                                <Route path='/product' element={<Product/>}/>
                                <Route path='/permission' element={<Permission/>}/>
                                <Route path='/user' element={<User/>}/>
                                <Route path='/charts' element={<Charts/>}/>
                                <Route path='/*' element={<Navigate replace to='/home' />} />
                            </Routes>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>&copy;Copyright 2021 Ryan Wu</Footer>
                </Layout>
            </Layout>
        );
    }
}
