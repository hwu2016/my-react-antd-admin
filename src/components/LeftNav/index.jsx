import React, { Component } from 'react'
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import menuList from '../../config/menuConfig';
import PubSub from 'pubsub-js'

const { Sider } = Layout;
const { SubMenu } = Menu;

export default class LeftNav extends Component {
    state = {
        collapsed: false,
    };

    onCollapse = collapsed => {
        this.setState({ collapsed });
    };

    //动态生成Menu，map+递归 （也可以通过reduce+递归）
    createMenuNodes = (menuList) => {
        return menuList.map(item => {
            if (item.children) {
                const child = item.children.find(child => child.key === window.location.pathname) 
                if (child) {
                    this.openKey = item.key
                }
                return (
                    (
                        <SubMenu key={item.key} icon={item.icon} title={item.title}>
                            {this.createMenuNodes(item.children)}
                        </SubMenu>
                    )
                )
            } else {
                return (
                    (
                        <Menu.Item key={item.key} icon={item.icon}>
                            <Link to={item.key} onClick={this.saveMenuItem(item)}>{item.title}</Link>
                        </Menu.Item>
                    )
                )
            }
        })
    }   

    saveMenuItem = (item) => {
        return () => {
            PubSub.publish('menuItem', item)
        }
    }

    render() {
        const menuNodes = this.createMenuNodes(menuList)
        const { collapsed } = this.state
        const { openKey } = this
        return (
            <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
                <div className="logo" style={collapsed === true ? { opacity: 0 } : { opacity: 1, transition: 'all 0.7s' }}>商品后台管理系统</div>
                <Menu theme="dark" defaultSelectedKeys={[window.location.pathname]} defaultOpenKeys={[openKey]} mode="inline">
                    {
                        menuNodes
                    }
                </Menu>
            </Sider>
        )
    }
}
