import React, { Component } from 'react'
import { Navigate } from 'react-router-dom'
import memoryUtils from '../../utils/memoryUtils'
import { Layout } from 'antd'
import LeftNav from '../../components/LeftNav'
import Head from '../../components/Head'
import Inner from '../../components/Inner'
import './index.css'


const { Footer } = Layout;

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
                    <Head/>
                    <Inner/>
                    <Footer style={{ textAlign: 'center' }}>&copy;Copyright 2021 Ryan Wu</Footer>
                </Layout>
            </Layout>
        );
    }
}
