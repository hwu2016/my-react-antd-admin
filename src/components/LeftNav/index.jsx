import React, { Component } from 'react'
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import menuList from '../../config/menuConfig';

const { Sider } = Layout;
const { SubMenu } = Menu;

export default class LeftNav extends Component {
    state = {
        collapsed: false,
        path: ''
    };

    onCollapse = collapsed => {
        this.setState({ collapsed });
    };

    componentDidMount(){
        const curPath = window.location.pathname
        const effectivePaths = this.findEffectivePaths(menuList).flat() //扁平化数组
        if (effectivePaths.indexOf(curPath) === -1) {
            this.setState({path: '/home'}) //如果不是有效path，就指向home
        } else {
            this.setState({path: curPath})
        }
    }

    //统计有效的path
    findEffectivePaths = (menuList) => {
        return menuList.map(item => {
            if (item.children) {
                return this.findEffectivePaths(item.children)
            } else {
                return item.key
            }
        })
    }

    //动态生成Menu，map+递归 （也可以通过reduce+递归）
    createMenuNodes = (menuList) => {
        return menuList.map(item => {
            return item.children ?
            (
                <SubMenu key={item.key} icon={item.icon} title={item.title}>
                    {this.createMenuNodes(item.children)}
                </SubMenu>
            ) :
            (
                <Menu.Item key={item.key} icon={item.icon}>
                    <Link to={item.key} onClick={() => {this.setState({path: item.key})}}>{item.title}</Link>
                </Menu.Item>
            )
        })
    }   

    render() {
        const { collapsed, path } = this.state
        return (
            <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
                <div className="logo" style={collapsed === true ? { opacity: 0 } : { opacity: 1, transition: 'all 0.7s' }}>商品后台管理系统</div>
                <Menu theme="dark" selectedKeys={[path]} mode="inline">
                    {
                        this.createMenuNodes(menuList)
                    }
                </Menu>
            </Sider>
        )
    }
}
